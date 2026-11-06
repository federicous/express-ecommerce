const assert = require('node:assert/strict');
const test = require('node:test');
const linked = require('../utils/managementLinkedInvoice');
const id = '0123456789abcdef01234567';

for (const operation of ['update', 'delete']) {
  test(`invoice ${operation} rejects a movement committed after its linkage read`, async () => {
    const invoice = { _id: id, code: 'SALE', monto: '100.50', cliente: 'CLIENT', __v: 0 };
    let actualRevision = 0;
    const model = {
      schema: { paths: { code: {}, monto: {}, cliente: {}, __v: {} } },
      findById: () => ({ lean: async () => ({ ...invoice }) }),
      async findOneAndUpdate(filter, change) {
        assert.equal(filter.__v, 0);
        assert.deepEqual(change.$inc, { __v: 1 });
        return filter.__v === actualRevision ? invoice : null;
      },
      async findOneAndDelete(filter) {
        assert.equal(filter.__v, 0);
        return filter.__v === actualRevision ? invoice : null;
      },
    };
    const movement = { async exists() {
      // Deterministic interleaving: read saw no movement, then its transaction committed.
      actualRevision += 1;
      return null;
    } };
    const controller = linked(model, movement, 'cliente');
    const res = { status(value) { this.code = value; return this; }, json(value) { this.body = value; return this; } };
    const req = { params: { id }, body: { monto: '40.00' } };
    await controller[operation === 'update' ? 'updateById' : 'deleteById'](req, res);
    assert.equal(res.code, 409);
    assert.equal(res.body.error, 'stale_invoice');
  });
}
test('invoice revision filter distinguishes a legacy missing version from a later initialized version', async () => {
  const model = {
    schema: { paths: { code: {}, monto: {}, cliente: {} } },
    findById: () => ({ lean: async () => ({ _id: id, code: 'SALE', monto: '100.50', cliente: 'CLIENT' }) }),
    async findOneAndUpdate(filter) { assert.deepEqual(filter.__v, { $exists: false }); return null; },
  };
  const controller = linked(model, { exists: async () => null }, 'cliente');
  const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await controller.updateById({ params: { id }, body: { monto: '40.00' } }, res);
  assert.equal(res.code, 409);
  assert.equal(res.body.error, 'stale_invoice');
});
