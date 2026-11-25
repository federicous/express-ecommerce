'use strict';
// Run only against the dedicated local MongoDB test instance on port 27041.
const assert=require('node:assert/strict');
const mongoose=require('mongoose');
const {createAdminOrderListHandler}=require('../utils/order-notifications/admin-order-list');
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27041/brm_admin_orders_test');
  const Order=mongoose.model('AdminOrderTest',new mongoose.Schema({},{strict:false}), 'orders');
  await Order.deleteMany({});
  await Order.collection.insertMany([
    {_id:new mongoose.Types.ObjectId('600000000000000000000001'),timestamp:'1794798000000',email:'older@example.test',productList:[{code:'A'}]},
    {_id:new mongoose.Types.ObjectId('600000000000000000000002'),timestamp:1794884400000,email:'new@example.test',presupuesto:'si',productList:[{code:'B'}],notification:{status:'accepted',recipients:[{address:'hidden@example.test'}]}}
  ]);
  const handler=createAdminOrderListHandler(Order,mongoose.Types.ObjectId);
  const call=async query=>{const res={status(n){this.code=n;return this},json(body){this.body=body;return this}};await handler({query},res);return res};
  const first=await call({limit:'1'});assert.equal(first.body.orders[0].email,'new@example.test');assert.equal(first.body.orders[0].presupuesto,true);assert.equal(first.body.orders[0].notificationStatus,'accepted');assert.equal(JSON.stringify(first.body).includes('hidden@example.test'),false);
  const second=await call({limit:'1',before:first.body.nextCursor});assert.equal(second.body.orders[0].email,'older@example.test');assert.equal(second.body.nextCursor,null);
  const email=await call({email:'older@example.test'});assert.equal(email.body.orders.length,1);
  const date=await call({from:'2026-11-16',to:'2026-11-16'});assert.equal(date.body.orders.length,1);
  console.log('ADMIN_ORDERS_MONGO_INTEGRATION_OK');await mongoose.disconnect();
}
main().catch(async e=>{console.error(e);await mongoose.disconnect();process.exitCode=1});
