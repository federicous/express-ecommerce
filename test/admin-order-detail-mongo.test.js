'use strict';
// Prueba de integración aislada con Mongoose real (schema/ordenes.js select:false) y mongod desechable en loopback.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const mongoose = require('mongoose');

process.env.NODEMAILER_USER = 'sender@synthetic.invalid';
process.env.NODEMAILER_ADMIN = 'admin-hidden@synthetic.invalid';
process.env.NODEMAILER_BCC = 'bcc-hidden@synthetic.invalid';

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
const { createAdminOrderDetailHandler } = require('../utils/order-notifications/admin-order-detail');
const { createAdminOrderListHandler } = require('../utils/order-notifications/admin-order-list');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

test('Mongoose real con notification select:false extrae historicalPricing sin exponer HTML ni destinatarios', { timeout: 60000 }, async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'brm-order-detail-mongo-'));
  const port = await freePort();
  const proc = spawn(
    'mongod',
    ['--dbpath', dir, '--bind_ip', '127.0.0.1', '--port', String(port), '--wiredTigerCacheSizeGB', '0.25', '--logpath', path.join(dir, 'mongo.log')],
    { stdio: 'ignore' }
  );

  try {
    const uri = `mongodb://127.0.0.1:${port}/brm_order_detail_test`;
    let connected = false;
    for (let i = 0; i < 60; i += 1) {
      if (proc.exitCode !== null) throw new Error(`isolated mongod exited with ${proc.exitCode}`);
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 400 });
        connected = true;
        break;
      } catch (_) {
        await mongoose.disconnect().catch(() => {});
        await sleep(200);
      }
    }
    assert.ok(connected, 'No se pudo iniciar mongod aislado');

    const Order = require('../schema/ordenes');
    assert.equal(Order.schema.path('notification').options.select, false);

    const products = [
      { code: 'M-IVA', name: 'Con IVA', lista: 'bremen', qty: 2, iva: '21', price: 9999, precioConIva: '1210.00', usd: 0, oferta: 'no' },
      { code: 'M-USD', name: 'En Dólares', lista: 'bremen', qty: 1, iva: '10,5', price: 0, precioConIva: '', usd: 10, oferta: 'no' },
      { code: 'M-EIN', name: 'Einhell', lista: 'einhell', qty: 1, iva: '21', price: 500, precioConIva: '', usd: 0, oferta: 'no' },
    ];
    const mail = await mailer.crearOrden(
      { email: 'cliente@synthetic.invalid', name: 'Cliente Test', vendedor: 'SYN' },
      products,
      10,
      1200,
      'vendedor-hidden@synthetic.invalid',
      undefined,
      ''
    );
    const notification = { ...createNotification(mail), status: 'accepted' };

    const saved = await Order.create({
      id: 'uuid-mongo-1',
      timestamp: '1794884400000',
      email: 'cliente@synthetic.invalid',
      state: 'pending',
      productList: products,
      presupuesto: '',
      notification,
    });

    const legacy = await Order.create({
      id: 'uuid-mongo-legacy',
      timestamp: '1794798000000',
      email: 'legacy@synthetic.invalid',
      state: 'pending',
      productList: [{ code: 'L1', name: 'Legado', qty: 1, iva: '21', price: 0, usd: 15 }],
      presupuesto: 'si',
    });

    // Verificación de regresión: lectura por defecto oculta notification; +notification.content.html la pierde en Mixed
    const defaultRead = await Order.findById(saved._id).lean();
    assert.equal(defaultRead.notification, undefined);
    const nestedSelectRead = await Order.findById(saved._id).select('+notification.status +notification.content.html').lean();
    assert.equal(nestedSelectRead.notification?.content?.html, undefined);

    const detailHandler = createAdminOrderDetailHandler(
      Order,
      id => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id) && mongoose.isValidObjectId(id)
    );
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

    const res = makeRes();
    await detailHandler({ params: { id: String(saved._id) } }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.notification, undefined);
    assert.equal(res.body.notificationStatus, 'accepted');
    assert.equal(res.body.historicalPricing.status, 'verified');
    assert.equal(res.body.historicalPricing.source, 'notification_html');
    assert.equal(res.body.historicalPricing.items[0].unitNetPrice, 900);
    assert.equal(res.body.historicalPricing.items[1].unitNetPrice, 10800);
    assert.equal(res.body.historicalPricing.items[2].unitNetPrice, 450);
    assert.equal(res.body.historicalPricing.sections.einhell.listDiscountNotice, true);
    assert.equal(res.body.historicalPricing.totals.total, 14656.5);

    const serialized = JSON.stringify(res.body);
    assert.equal(serialized.includes('<tbody'), false);
    assert.equal(serialized.includes('tablaProductosOther'), false);
    assert.equal(serialized.includes('bcc-hidden@synthetic.invalid'), false);
    assert.equal(serialized.includes('admin-hidden@synthetic.invalid'), false);
    assert.equal(serialized.includes('vendedor-hidden@synthetic.invalid'), false);

    const legacyRes = makeRes();
    await detailHandler({ params: { id: String(legacy._id) } }, legacyRes);
    assert.equal(legacyRes.code, 200);
    assert.equal(legacyRes.body.notification, undefined);
    assert.equal(legacyRes.body.notificationStatus, 'unavailable');
    assert.equal(legacyRes.body.historicalPricing.status, 'unavailable');
    assert.equal(legacyRes.body.historicalPricing.reason, 'missing_notification_html');

    // Verificación en MongoDB real de filtros combinados en admin-order-list
    const listHandler = createAdminOrderListHandler(Order, mongoose.Types.ObjectId);
    const quoteRes = makeRes();
    await listHandler({ query: { type: 'quote', notificationStatus: 'unavailable' } }, quoteRes);
    assert.equal(quoteRes.code, 200);
    assert.equal(quoteRes.body.orders.length, 1);
    assert.equal(quoteRes.body.orders[0].email, 'legacy@synthetic.invalid');
  } finally {
    await mongoose.disconnect().catch(() => {});
    if (proc.exitCode === null) {
      proc.kill('SIGTERM');
      await sleep(300);
    }
    await fs.rm(dir, { recursive: true, force: true });
  }
});
