'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {createAdminOrderListHandler} = require('../utils/order-notifications/admin-order-list');
const id='6b03ac423080ded40be349a0';
function setup(rows) {
  let pipeline;
  const handler=createAdminOrderListHandler({aggregate:async p=>{pipeline=p;return rows;}},function ObjectId(value){return value});
  const res={code:200,status(n){this.code=n;return this},json(body){this.body=body;return this}};
  return {handler,res,pipeline:()=>pipeline};
}
test('paginates using an extra record and does not expose notification recipients',async()=>{
  const x=setup([{_id:id,email:'one@example.test',productCount:2,notification:{status:'accepted',recipients:[{address:'secret@example.test'}]}},{_id:'6b03ac423080ded40be349a1',productCount:1}]);
  await x.handler({query:{limit:'1'}},x.res);
  assert.equal(x.res.body.orders.length,1);assert.equal(x.res.body.nextCursor,id);
  assert.equal(x.res.body.orders[0].notificationStatus,'accepted');assert.equal(JSON.stringify(x.res.body).includes('secret@example.test'),false);
  assert.deepEqual(x.pipeline().find(p=>p.$sort).$sort,{_id:-1});
});
test('invalid filters are rejected before database access',async()=>{
  const x=setup([]);await x.handler({query:{limit:'101'}},x.res);assert.equal(x.res.code,400);assert.equal(x.pipeline(),undefined);
});
test('escapes email regex and applies Argentine calendar boundaries',async()=>{
  const x=setup([]);await x.handler({query:{email:'a+b@example.test',from:'2026-11-16',to:'2026-11-16'}},x.res);
  assert.equal(x.pipeline()[0].$match.email.$regex,'a\\+b@example\\.test');
  const range=x.pipeline().find(p=>p.$match?._orderTime).$match._orderTime;
  assert.equal(range.$gte,Date.parse('2026-11-16T00:00:00-03:00'));assert.equal(range.$lt-range.$gte,86400000);
});
