const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const bcrypt = require('bcryptjs');
const { publicUser,passwordChange } = require('../components/usuarios/services/publicUser');
const logs=[], writes=[];
let found, saved;
class User {
  constructor(value) { Object.assign(this,value); this._id='a'.repeat(24); }
  async save() { saved={...this}; writes.push(saved); return saved; }
  static async findOneAndUpdate(filter,update) { writes.push(update); saved={...saved,...update.$set}; return saved; }
  static async deleteOne() { return {deletedCount:1}; }
  static findOne() { return found; }
  static find() { return {select(projection) { assert.equal(projection,'-password'); return [publicUser(saved)]; }}; }
  static findById() { return {select(projection) { assert.equal(projection,'-password'); return publicUser(saved); }}; }
}
const target=require.resolve('../components/usuarios/services/mongo');
const original=Module._load;
let Service;
try {
  Module._load=function(name,parent,isMain) {
    if(parent?.filename===target && name.endsWith('/schema/usuarios'))return User;
    if(parent?.filename===target && name.endsWith('/config/mongo'))return {mongoose:{isValidObjectId:id=>/^[a-f0-9]{24}$/.test(id)}};
    if(name.includes('logger/pino'))return {info: (...v)=>logs.push(v),error: (...v)=>logs.push(v)};
    return original.call(this,name,parent,isMain);
  }; Service=require(target);
} finally { Module._load=original; }
const service=new Service();
test.beforeEach(()=>{saved={_id:'a'.repeat(24),name:'Original',password:bcrypt.hashSync('OriginalPass1',4)};found=undefined;writes.length=0;logs.length=0;});
test('public DTO omits password for plain and mongoose objects without mutating',()=>{
 assert.equal(publicUser('seller@synthetic.test'),'seller@synthetic.test'); const source={name:'Test',password:'secret'};assert.deepEqual(publicUser(source),{name:'Test'});assert.equal(source.password,'secret');assert.deepEqual(publicUser({toObject:()=>source}),{name:'Test'});
});
for(const password of [null,{},[],123,'   ','$2b$10$legacy-hash','é'.repeat(37)]) {
 test(`invalid password ${JSON.stringify(password)} rejects before write`,async()=>{
  await assert.rejects(()=>service.modifyUser({_id:saved._id,password}),e=>e.status===400);assert.equal(writes.length,0);
 });
}
test('omitted or empty password preserves exact stored hash',async()=>{
 const hash=saved.password;
 for(const password of [undefined,'']) {const result=await service.modifyUser({_id:saved._id,name:'Changed',...(password===undefined?{}:{password})});assert.equal(saved.password,hash);assert.equal(Object.hasOwn(writes.at(-1).$set,'password'),false);assert.equal(result.user.password,undefined);}
});
test('explicit new password hashed once and not returned or logged',async()=>{
 const input={_id:saved._id,password:'NewSecret1'}; const result=await service.modifyUser(input);assert.ok(bcrypt.compareSync(input.password,saved.password));assert.equal(result.user.password,undefined);assert.equal(input.password,'NewSecret1');assert.ok(!JSON.stringify(logs).includes(input.password));assert.ok(!JSON.stringify(logs).includes(saved.password));
});
test('create returns persisted identity but not password and does not mutate input',async()=>{
 const input={email:'synthetic@test.invalid',password:'NewSecret1'};const result=await service.createUser(input,'avatar');assert.equal(result._id,'a'.repeat(24));assert.equal(result.password,undefined);assert.equal(input.password,'NewSecret1');assert.ok(bcrypt.compareSync(input.password,saved.password));assert.ok(!JSON.stringify(logs).includes(saved.password));
});
test('creation needs a password, duplicate email rejects',async()=>{
 assert.throws(()=>passwordChange('',true),e=>e.status===400);found={email:'existing'};await assert.rejects(()=>service.createUser({email:'existing',password:'Pass1'},'avatar'),e=>e.status===409);assert.equal(writes.length,0);
});
test('list and detail explicitly project out password',async()=>{assert.equal((await service.getAll())[0].password,undefined);assert.equal((await service.getById(saved._id)).password,undefined);});
test('operators and object fields rejected without writes',async()=>{
 for(const input of [{$set:{password:'hack'}},{name:{$ne:null}},{'name.x':'hack'}])await assert.rejects(()=>service.modifyUser({_id:saved._id,...input}),e=>e.status===400);assert.equal(writes.length,0);
});
test('invalid identity rejected before writes',async()=>{await assert.rejects(()=>service.modifyUser({_id:{$ne:null}}),e=>e.status===400);assert.equal(writes.length,0);});
