const test=require('node:test'),assert=require('node:assert/strict');
const {createReadinessHandler}=require('../routes/readiness');
async function probe(hello,{readyState=1,managementEnabled=true,reject=false,timeout=false}={}){
 let calls=0,code,body,header;const connection={readyState,db:{admin:()=>({command:(value,options)=>{calls++;assert.deepEqual(value,{hello:1});assert.equal(options.maxTimeMS,20);return timeout?new Promise(()=>{}):reject?Promise.reject(new Error('mongodb://fake-secret')):Promise.resolve(hello);}})}};
 const res={set:(k,v)=>{header=[k,v];},status:v=>{code=v;return res;},json:v=>{body=v;return res;}};
 await createReadinessHandler({connection,managementEnabled,timeoutMs:20})({},res);
 assert.deepEqual(header,['Cache-Control','no-store']);assert.equal(JSON.stringify(body).includes('fake-secret'),false);return {code,body,calls};
}
test('readiness accepts connected writable replica set',async()=>assert.equal((await probe({isWritablePrimary:true,setName:'synthetic'})).code,200));
test('readiness rejects disconnected DB without queuing commands',async()=>{const r=await probe({}, {readyState:0});assert.equal(r.code,503);assert.equal(r.calls,0);});
test('management readiness rejects standalone despite writable hello',async()=>assert.equal((await probe({isWritablePrimary:true})).code,503));
test('non-management readiness allows writable standalone',async()=>assert.equal((await probe({isWritablePrimary:true},{managementEnabled:false})).code,200));
test('readiness rejects secondary replica set',async()=>assert.equal((await probe({isWritablePrimary:false,setName:'synthetic'})).code,503));
test('readiness hides database driver error',async()=>assert.deepEqual((await probe({}, {reject:true})).body,{status:'not_ready'}));
test('readiness bounds slow DB response',async()=>assert.equal((await probe({}, {timeout:true})).code,503));
test('readiness permits legacy writable replica-set hello',async()=>assert.equal((await probe({ismaster:true,setName:'synthetic'})).code,200));
