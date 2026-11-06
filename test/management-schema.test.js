const assert = require('node:assert/strict');
const test = require('node:test');

const models = {
  venta: require('../schema/facturaClientes'),
  cobro: require('../schema/cobroClientes'),
  compra: require('../schema/facturaProveedor'),
  pago: require('../schema/pagos'),
  cheque: require('../schema/cheques'),
  gasto: require('../schema/gastos'),
  devolucion: require('../schema/devoluciones'),
  pendiente: require('../schema/pendientes'),
};
const MovementAttempt = require('../schema/managementMovementAttempt');

test('all eight management models reject missing or blank document codes', () => {
  for (const [name, Model] of Object.entries(models)) {
    assert.equal(Model.schema.path('code').instance, 'String', name);
    assert.equal(Model.schema.path('code').isRequired, true, name);
    assert.equal(new Model({}).validateSync()?.errors?.code?.kind, 'required', name);
    assert.equal(new Model({ code: '   ' }).validateSync()?.errors?.code?.kind, 'required', name);
    assert.equal(new Model({ code: ' DOC-1 ' }).code, 'DOC-1', name);
  }
});

test('legacy management fields are typed rather than unvalidated Mixed', () => {
  for (const [name, Model] of Object.entries(models)) {
    for (const [field, path] of Object.entries(Model.schema.paths)) {
      if (field === '_id' || field === '__v') continue;
      assert.notEqual(path.instance, 'Mixed', `${name}.${field}`);
    }
    assert.equal(Model.schema.path('timestamp').instance, 'Number', name);
    assert.equal(new Model({ code: 'DOC-1' }).validateSync(), undefined, name);
  }
});

test('an object is not silently accepted as a monetary amount', () => {
  for (const name of ['venta', 'cobro', 'compra', 'pago', 'cheque', 'gasto']) {
    const Model = models[name];
    const error = new Model({ code: 'DOC-1', monto: { cents: 100 } }).validateSync();
    assert.equal(error?.errors?.monto?.name, 'CastError', name);
  }
});

test('new movement identity field is optional for legacy rows and typed', () => {
  for (const name of ['cobro', 'pago']) {
    const Model = models[name];
    assert.equal(Model.schema.path('invoiceId').instance, 'String', name);
    assert.equal(Model.schema.path('chequeId').instance, 'String', name);
    assert.equal(Model.schema.path('cheque').instance, 'String', name);
    assert.equal(new Model({ code: 'LEGACY' }).validateSync(), undefined, name);
  }
  assert.equal(models.cheque.schema.path('linkVersion').instance, 'String');
  assert.equal(new models.cheque({ code: 'LEGACY' }).validateSync(), undefined);
});

test('movement attempts use a string _id key, actor/resource scope and no automatic TTL', () => {
  assert.equal(MovementAttempt.schema.options.collection, 'managementMovementAttempts');
  for (const field of ['_id', 'resource', 'actor', 'fingerprint', 'movementId', 'createdAt']) {
    assert.equal(MovementAttempt.schema.path(field).isRequired, true, field);
  }
  assert.equal(MovementAttempt.schema.path('_id').instance, 'String');
  assert.equal(MovementAttempt.schema.path('actor').instance, 'String');
  assert.equal(MovementAttempt.schema.path('movementId').instance, 'ObjectID');
  assert.equal(MovementAttempt.schema.indexes().some(([, options]) => options.expireAfterSeconds !== undefined), false);
});
