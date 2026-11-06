const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');

const resources = [
  ['facturaCliente', 'duplicate_code'], ['facturaProveedor', 'duplicate_code'],
  ['cheques', 'duplicate_code'], ['cobroCliente', 'reference_not_found'],
  // D05a devoluciones has a dedicated contract with required detail and a unique sale link;
  // it is exercised through real HTTP/Mongo in scripts/validate-management-d05a.js.
  // D05b pendientes has its own operational lifecycle and integration profile.
  ['pagos', null], ['gastos', null],
];

for (const [resource, rejection] of resources) {
  test(`${resource} save exposes typed rejection and preserves validation errors`, async () => {
    const modulePath = require.resolve(`../components/${resource}/services/mongo`);
    const state = { existing: [], reference: [{}], failure: null };
    class SyntheticModel {
      constructor(data) { this.data = data; }
      static async find() { return state.existing; }
      async save() {
        if (state.failure) throw state.failure;
        return { _id: 'synthetic', ...this.data };
      }
    }
    const referenceModel = { find: async () => state.reference };
    const originalLoad = Module._load;
    Module._load = function syntheticPersistence(name, parent, isMain) {
      if (name.includes('logger/pino')) return { info() {}, error() {} };
      if (parent?.filename === modulePath && name.startsWith('../../../schema/')) {
        return name.endsWith('facturaClientes') && rejection === 'reference_not_found'
          ? referenceModel : SyntheticModel;
      }
      return originalLoad.call(this, name, parent, isMain);
    };
    let service;
    try {
      delete require.cache[modulePath];
      service = new (require(modulePath))();
    } finally {
      Module._load = originalLoad;
    }
    const saved = await service.save({ code: 'SYNTHETIC', monto: '100.50', fecha: '02/10/2026' });
    assert.equal(saved.resultado._id, 'synthetic');

    if (rejection) {
      state.existing = [{}];
      state.reference = [];
      const refused = await service.save({ code: 'SYNTHETIC', monto: '100.50', fecha: '02/10/2026' });
      assert.equal(refused.error, rejection);
      assert.equal(refused.resultado, undefined);
    }
    state.existing = [];
    state.reference = [{}];
    state.failure = Object.assign(new Error('invalid field'), { name: 'ValidationError' });
    await assert.rejects(service.save({ code: 'SYNTHETIC', monto: '100.50', fecha: '02/10/2026' }), (error) => error === state.failure);
  });
}

test('devoluciones derives a pending sale link and rejects unvalued-contract overrides', async () => {
  const modulePath = require.resolve('../components/devoluciones/services/mongo');
  const state = { sales: [{ _id: 'sale-id', code: 'SALE', cliente: 'CLIENT' }], failure: null };
  class ReturnModel {
    constructor(data) { this.data = data; }
    async save() {
      if (state.failure) throw state.failure;
      return { _id: 'return-id', ...this.data };
    }
  }
  const SaleModel = { find: () => ({ limit: () => ({ lean: async () => state.sales }) }) };
  const originalLoad = Module._load;
  Module._load = function syntheticReturnModels(name, parent, isMain) {
    if (parent?.filename === modulePath && name.endsWith('/schema/devoluciones')) return ReturnModel;
    if (parent?.filename === modulePath && name.endsWith('/schema/facturaClientes')) return SaleModel;
    return originalLoad.call(this, name, parent, isMain);
  };
  let service;
  try {
    delete require.cache[modulePath];
    service = new (require(modulePath))();
  } finally { Module._load = originalLoad; }
  const base = { code: 'SALE', cliente: 'CLIENT', fecha: '29/09/2026',
    codigoProducto: 'P-1', detalle: 'Defectuoso' };
  assert.equal((await service.save({ ...base, monto: '1.00' })).error, 'invalid_return');
  assert.equal((await service.save({ ...base, fecha: '31/02/2026' })).error, 'invalid_return');
  const saved = await service.save(base);
  assert.equal(saved.resultado.invoiceId, 'sale-id');
  assert.equal(saved.resultado.reconciliationStatus, 'pending');
  assert.equal(saved.resultado.monto, undefined);
  state.failure = Object.assign(new Error('invalid field'), { name: 'ValidationError' });
  await assert.rejects(service.save(base), (error) => error === state.failure);
});

test('pendientes derives an operational sale link without accepting client state or money', async () => {
  const modulePath = require.resolve('../components/pendientes/services/mongo');
  const state = { sales: [{ _id: 'sale-id', code: 'SALE', cliente: 'CLIENT' }], failure: null };
  class PendingModel {
    constructor(data) { this.data = data; }
    async save() {
      if (state.failure) throw state.failure;
      return { _id: 'pending-id', ...this.data };
    }
  }
  const SaleModel = { find: () => ({ limit: () => ({ lean: async () => state.sales }) }) };
  const originalLoad = Module._load;
  Module._load = function syntheticPendingModels(name, parent, isMain) {
    if (parent?.filename === modulePath && name.endsWith('/schema/pendientes')) return PendingModel;
    if (parent?.filename === modulePath && name.endsWith('/schema/facturaClientes')) return SaleModel;
    return originalLoad.call(this, name, parent, isMain);
  };
  let service;
  try {
    delete require.cache[modulePath];
    service = new (require(modulePath))();
  } finally { Module._load = originalLoad; }
  const base = { code: 'SALE', cliente: 'CLIENT', fecha: '29/09/2026', listaProductos: 'P-1' };
  assert.equal((await service.save({ ...base, monto: '1.00' })).error, 'invalid_pending');
  assert.equal((await service.save({ ...base, estado: 'finalizado' })).error, 'invalid_pending');
  assert.equal((await service.save({ ...base, fecha: '31/02/2026' })).error, 'invalid_pending');
  const saved = await service.save(base);
  assert.equal(saved.resultado.invoiceId, 'sale-id');
  assert.equal(saved.resultado.estado, 'pendiente');
  assert.equal(saved.resultado.trackingVersion, 'd05b');
  assert.equal(saved.resultado.monto, undefined);
  state.failure = Object.assign(new Error('invalid field'), { name: 'ValidationError' });
  await assert.rejects(service.save(base), (error) => error === state.failure);
});
