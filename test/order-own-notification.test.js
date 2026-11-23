'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createOwnStatusHandler } = require('../utils/order-notifications/own-status');
const id = '6b03ac423080ded40be349a0';
const alice = 'alice@example.com';
function fixture(document) {
  let filter;
  const Order = { findOne(query) { filter = query; return { select() { return { lean: async () => document && document.email === query.email && query._id === id ? document : null }; } }; } };
  const handler = createOwnStatusHandler(Order, value => value === id);
  const res = { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  return { handler, res, filter: () => filter };
}
test('owner sees only their accepted status, not other recipients or message contents', async () => {
  const x = fixture({email: alice, notification: {status:'review', content:{text:'secret'}, recipients:[{address:alice,status:'accepted'},{address:'private@example.com',status:'rejected'}]}});
  await x.handler({params:{id},user:{email:alice}}, x.res);
  assert.deepEqual(x.res.body,{status:'accepted'}); assert.equal(x.filter().email,alice);
});
test('another user cannot read the notification', async () => {
  const x=fixture({email:alice,notification:{status:'accepted',recipients:[{address:alice,status:'accepted'}]}});
  await x.handler({params:{id},user:{email:'other@example.com'}},x.res);
  assert.equal(x.res.code,404); assert.deepEqual(x.res.body,{message:'Pedido no encontrado'});
});
test('old orders and absent recipients do not claim success', async () => {
  for (const notification of [undefined,{status:'accepted',recipients:[]}]) {
    const x=fixture({email:alice,notification}); await x.handler({params:{id},user:{email:alice}},x.res); assert.equal(x.res.body.status,'unavailable');
  }
});
test('pending, sending, and review are shown honestly', async () => {
  for (const status of ['pending','sending','review']) {
    const x=fixture({email:alice,notification:{status,recipients:[{address:alice,status:'pending'}]}});
    await x.handler({params:{id},user:{email:alice}},x.res); assert.equal(x.res.body.status,status);
  }
});
test('missing identity and invalid id do not query database', async () => {
  const x=fixture(null); await x.handler({params:{id},user:{}},x.res); assert.equal(x.res.code,404);assert.equal(x.filter(),undefined);
});
