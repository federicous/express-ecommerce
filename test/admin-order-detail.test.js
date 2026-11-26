'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');

process.env.NODEMAILER_USER = 'sender@synthetic.invalid';
process.env.NODEMAILER_ADMIN = 'admin@synthetic.invalid';
delete process.env.NODEMAILER_BCC;

const transportPath = require.resolve('../utils/nodemailer/transport');
require.cache[transportPath] = {
  id: transportPath,
  filename: transportPath,
  loaded: true,
  exports: {
    sendMail: () => {
      throw new Error('Unexpected SMTP send');
    },
  },
};

const mailer = require('../utils/nodemailer');
const { createNotification } = require('../utils/order-notifications/create-notification');
const {
  extractHistoricalPricing,
  createAdminOrderDetailHandler,
} = require('../utils/order-notifications/admin-order-detail');

const VALID_ID = '6b03ac423080ded40be349a0';

async function buildOrderWithMail({ productList, descuento = 0, dolar = 1000, presupuesto = '' }) {
  const user = { email: 'cliente@synthetic.invalid', name: 'Cliente Sintético', vendedor: 'SYN' };
  const mail = await mailer.crearOrden(user, productList, descuento, dolar, 'vendedor@synthetic.invalid', undefined, presupuesto);
  const notification = createNotification(mail);
  return {
    _id: VALID_ID,
    id: 'uuid-1',
    email: user.email,
    timestamp: 1700000000000,
    presupuesto,
    productList,
    notification,
  };
}

test('extractHistoricalPricing verifica importes exactos de checkout para precioConIva, oferta, usd, descuento y einhell', async () => {
  const productList = [
    // 1) precioConIva (1210 / 1.21 = 1000) con descuento 10% => 900.00 neto
    { code: 'P-CON-IVA', name: 'Con IVA', lista: 'bremen', qty: 2, iva: '21', price: 9999, precioConIva: '1210.00', usd: 0, oferta: 'no', precioOferta: '' },
    // 2) oferta='si' + precioOferta => 750.00 neto SIN descuento aunque descuento=10%
    { code: 'P-OFERTA', name: 'En Oferta', lista: 'bremen', qty: 1, iva: '21', price: 1500, precioConIva: '', usd: 5, oferta: 'si', precioOferta: '750.00' },
    // 3) usd=10 con price=0 (o viejo), dolar=1200 => 12000 * 0.90 = 10800.00 neto
    { code: 'P-USD', name: 'En Dólares', lista: 'bremen', qty: 1, iva: '10,5', price: 0, precioConIva: '', usd: 10, oferta: 'on', precioOferta: '500' },
    // 4) código repetido en sección einhell con price=500 y descuento 10% => 450.00 neto
    { code: 'P-CON-IVA', name: 'Einhell Dup', lista: 'einhell', qty: 3, iva: '21', price: 500, precioConIva: '', usd: 0, oferta: 'no', precioOferta: '' },
  ];

  const order = await buildOrderWithMail({ productList, descuento: 10, dolar: 1200 });
  const pricing = extractHistoricalPricing(order);

  assert.equal(pricing.status, 'verified');
  assert.equal(pricing.source, 'notification_html');
  assert.equal(pricing.currency, 'ARS');
  assert.equal(pricing.priceBasis, 'net_unit_without_iva');
  assert.equal(pricing.items.length, 4);

  assert.deepEqual(pricing.items[0], {
    index: 0,
    code: 'P-CON-IVA',
    qty: 2,
    unitNetPrice: 900,
    ivaPercent: 21,
    lineNetSubtotal: 1800,
    section: 'other',
  });
  assert.equal(pricing.items[1].unitNetPrice, 750);
  assert.equal(pricing.items[2].unitNetPrice, 10800);
  assert.equal(pricing.items[2].ivaPercent, 10.5);
  assert.equal(pricing.items[3].unitNetPrice, 450);
  assert.equal(pricing.items[3].section, 'einhell');

  assert.deepEqual(pricing.sections.other, { subtotal: 13350, iva: 1669.5, total: 15019.5 });
  assert.deepEqual(pricing.sections.einhell, {
    subtotal: 1350,
    iva: 283.5,
    total: 1633.5,
    listDiscountNotice: true,
  });
  assert.deepEqual(pricing.totals, { subtotal: 14700, iva: 1953, total: 16653 });
});

test('extractHistoricalPricing falla cerrado ante órdenes históricas sin notificación o con discrepancias', async () => {
  const baseList = [{ code: 'P1', name: 'Prod', lista: 'bremen', qty: 2, iva: '21', price: 100, usd: 0 }];
  const validOrder = await buildOrderWithMail({ productList: baseList, descuento: 0, dolar: 1000 });

  // Sin notificación (orden histórica previa al outbox)
  assert.equal(extractHistoricalPricing({ _id: VALID_ID, productList: baseList }).status, 'unavailable');

  // Discrepancia de cantidad
  const qtyMismatch = structuredClone(validOrder);
  qtyMismatch.productList[0].qty = 99;
  assert.equal(extractHistoricalPricing(qtyMismatch).status, 'unavailable');

  // Discrepancia de código
  const codeMismatch = structuredClone(validOrder);
  codeMismatch.productList[0].code = 'OTRO';
  assert.equal(extractHistoricalPricing(codeMismatch).status, 'unavailable');

  // Totales manipulados en HTML
  const tamperedTotals = structuredClone(validOrder);
  tamperedTotals.notification.content.html = tamperedTotals.notification.content.html.replace('242.00', '999.00');
  assert.equal(extractHistoricalPricing(tamperedTotals).status, 'unavailable');

  // Etiquetas HTML inesperadas dentro de celda
  const injectedTd = structuredClone(validOrder);
  injectedTd.notification.content.html = injectedTd.notification.content.html.replace('>Prod<', '>Prod<td>extra</td><');
  assert.equal(extractHistoricalPricing(injectedTd).status, 'unavailable');

  // Precio NaN generado en HTML
  const nanOrder = structuredClone(validOrder);
  nanOrder.notification.content.html = nanOrder.notification.content.html.replace('100.00', 'NaN');
  assert.equal(extractHistoricalPricing(nanOrder).status, 'unavailable');
});

test('createAdminOrderDetailHandler valida ID, protege notification/html/recipients y entrega historicalPricing', async () => {
  const productList = [{ code: 'P1', name: 'Llave', lista: 'bremen', qty: 2, iva: '21', price: 100, usd: 0 }];
  const validOrder = await buildOrderWithMail({ productList });
  validOrder.notification.recipients.push({ address: 'oculto@synthetic.invalid', kind: 'bcc', status: 'accepted' });

  let selected = null;
  const Order = {
    findById(id) {
      return {
        select(sel) {
          selected = sel;
          return {
            lean: async () => (id === VALID_ID ? validOrder : null),
          };
        },
      };
    },
  };
  const handler = createAdminOrderDetailHandler(Order, id => /^[0-9a-fA-F]{24}$/.test(id));
  const makeRes = () => ({
    code: 200,
    status(n) {
      this.code = n;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  });

  const badIdRes = makeRes();
  await handler({ params: { id: 'bad' } }, badIdRes);
  assert.equal(badIdRes.code, 400);

  const notFoundRes = makeRes();
  await handler({ params: { id: '6b03ac423080ded40be349a1' } }, notFoundRes);
  assert.equal(notFoundRes.code, 404);

  const okRes = makeRes();
  await handler({ params: { id: VALID_ID } }, okRes);
  assert.equal(okRes.code, 200);
  assert.equal(selected, '+notification');
  assert.equal(okRes.body.notification, undefined);
  assert.equal(okRes.body.notificationStatus, 'pending');
  assert.equal(okRes.body.historicalPricing.status, 'verified');
  assert.equal(okRes.body.historicalPricing.totals.total, 242);

  const serialized = JSON.stringify(okRes.body);
  assert.equal(serialized.includes('oculto@synthetic.invalid'), false);
  assert.equal(serialized.includes('<tbody'), false);
  assert.equal(serialized.includes('tablaProductosOther'), false);
});
