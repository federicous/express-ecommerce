const assert = require('node:assert/strict');
const test = require('node:test');
const Module = require('node:module');
const { validAmount, validDate, validateDocument } = require('../utils/managementDocumentInput');

 test('document amount accepts exact positive decimal strings/numbers without rounding', () => {
  for (const value of ['0.01', '100.50', ' 100.50 ', 100.50, '001.20']) assert.equal(validAmount(value), true);
  for (const value of [undefined, null, '', ' ', 'abc', '10.001', '0', 0, -1, '-1', NaN, Infinity, '1e2', '1,20', true, {}, []]) assert.equal(validAmount(value), false);
});
test('document dates reject rollover and validate leap years without timezone conversion', () => {
  for (const value of ['02/10/2026', '29/02/2024', ' 31/12/2025 ']) assert.equal(validDate(value), true);
  for (const value of [undefined, '', '31/02/2026', '29/02/2025', '00/01/2026', '01/13/2026', '2026-10-02', 20261002, {}]) assert.equal(validDate(value), false);
});
test('partial edit validates supplied values only, optional due date and no chronological assumption', () => {
  assert.equal(validateDocument({ detalle: 'Descripción' }, { partial: true }), null);
  assert.equal(validateDocument({ monto: '100.50', fecha: '02/10/2026', vencimiento: '' }), null);
  assert.equal(validateDocument({ monto: '100.50', fecha: '02/10/2026', vencimiento: '01/10/2026' }), null);
  assert.equal(validateDocument({ monto: '1', fecha: '02/10/2026', vencimiento: '31/02/2026' }), 'invalid_date');
  assert.equal(validateDocument({ monto: undefined }, { partial: true }), 'invalid_amount');
  assert.equal(validateDocument([], { partial: true }), 'invalid_payload');
});
for (const resource of ['facturaCliente', 'facturaProveedor', 'gastos']) {
  test(`${resource} invalid creation cannot query or write, including array payloads`, async () => {
    const path = require.resolve(`../components/${resource}/services/mongo`);
    const original = Module._load;
    const Model = class {
      constructor() { throw new Error('must not construct model'); }
      static find() { throw new Error('must not query'); }
    };
    Module._load = function(name, parent, isMain) {
      if (parent?.filename === path && name.startsWith('../../../schema/')) return Model;
      if (name.includes('logger/pino')) return { error() {}, info() {} };
      return original.call(this, name, parent, isMain);
    };
    let service;
    try { delete require.cache[path]; service = new (require(path))(); } finally { Module._load = original; }
    const base = { code: 'SYNTHETIC', monto: '100.50', fecha: '02/10/2026' };
    for (const monto of [undefined, null, '0', '-1', '10.001', true]) {
      assert.equal((await service.save({ ...base, monto })).error, 'invalid_amount');
    }
    assert.equal((await service.save({ ...base, fecha: '31/02/2026' })).error, 'invalid_date');
    assert.equal((await service.save([base])).error, 'invalid_payload');
  });
}
for (const party of ['cliente', 'proveedor', 'gasto']) {
  test(`${party} malformed edit never calls update and preserves description-only legacy edit`, async () => {
    const id = '0123456789abcdef01234567'; let writes = 0;
    const model = { schema: { paths: { code: {}, monto: {}, fecha: {}, vencimiento: {}, detalle: {}, [party]: {} } },
      findById: () => ({ lean: async () => ({ _id: id, code: 'OLD', monto: 'legacy-invalid', fecha: 'legacy-invalid', [party]: 'SYNTHETIC' }) }),
      async findOneAndUpdate(_filter, change) { writes++; return { _id: id, ...change.$set }; },
    };
    const controller = require('../utils/managementLinkedInvoice')(model, { exists: async () => false }, party);
    const res = () => ({ status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
    for (const body of [{ monto: '10.001' }, { monto: '0' }, { fecha: '31/02/2026' }, { vencimiento: '29/02/2025' }]) {
      const response = res(); await controller.updateById({ params: { id }, body }, response);
      assert.equal(response.code, 400); assert.equal(writes, 0);
    }
    const response = res(); await controller.updateById({ params: { id }, body: { detalle: 'Corrección descriptiva' } }, response);
    assert.equal(response.code, 200); assert.equal(writes, 1);
    assert.equal(response.body.response.monto, undefined); // no historical rewrite
  });
}
