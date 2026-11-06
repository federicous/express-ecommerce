// Opt-in isolated integration only. Never accepts production DB/API or opens SMTP.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
assert.equal(process.env.BRM_ACCEPTANCE,'isolated-only');
const u=new URL(process.env.MONGO_URI),base=new URL(process.env.BRM_ACCEPTANCE_BASE);
assert.equal(u.protocol,'mongodb:');assert.equal(u.hostname,'127.0.0.1');assert.ok(!['27017','27028','27029',''].includes(u.port));assert.equal(u.pathname,'/brmtools_validation');assert.equal(base.protocol,'http:');assert.equal(base.hostname,'127.0.0.1');assert.ok(Number(base.port)>1024);assert.ok(!['8088','8091','18089'].includes(base.port));
const password=process.env.BRM_ACCEPTANCE_PASSWORD;assert.ok(typeof password==='string'&&password.length>=16);
const {MongoClient}=require('mongodb'),bcrypt=require('bcryptjs');
const cases=[],add=(id,evidence={})=>cases.push({id,status:'approved',...evidence});let dbClient;
const api=async(route,{method='GET',body,token,key}={})=>{const reply=await fetch(base.origin+route,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{}),...(key?{'Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000)});return {status:reply.status,body:await reply.json()};};
const cents=value=>{const m=/^(\d+)(?:\.(\d{1,2}))?$/.exec(String(value));assert.ok(m);return Number(m[1])*100+Number((m[2]||'').padEnd(2,'0'));};
(async()=>{
 const health=await api('/health');assert.equal(health.status,200);assert.equal(health.body.service,'brmtools-validation-api');assert.equal((await api('/ready')).status,200);
 dbClient=await MongoClient.connect(u.href,{serverSelectionTimeoutMS:3000});const db=dbClient.db('brmtools_validation');assert.ok((await db.admin().command({hello:1})).setName);
 const suffix=crypto.randomBytes(6).toString('hex'),operator='operator-'+suffix+'@synthetic.test',buyer='buyer-'+suffix+'@synthetic.test';
 await db.collection('usuarios').insertMany([{email:operator,name:'Synthetic operator',password:bcrypt.hashSync(password,10),isAdmin:'on',isSeller:'off',enable:'on',descuento:'0',vendedor:'Synthetic seller',IdVendedor:'synthetic'},{email:buyer,name:'Synthetic buyer',password:bcrypt.hashSync(password,10),isAdmin:'off',isSeller:'off',enable:'on',descuento:'10',vendedor:'Synthetic seller'}]);
 const login=await api('/login',{method:'POST',body:{email:operator,password}});assert.equal(login.status,200);const token=login.body.token;
 const buyerLogin=await api('/login',{method:'POST',body:{email:buyer,password}});assert.equal(buyerLogin.status,200);
 assert.equal((await api('/api/management/options')).status,401);assert.equal((await api('/api/management/options',{token:buyerLogin.body.token})).status,403);assert.equal((await api('/api/auth/session',{token})).body.user.email,operator);add('BRM-real-login-session-and-management-permissions');
 const documents=[];
 for(const [invoice,movement,party]of [['facturaCliente','cobroCliente','cliente'],['facturaProveedor','pagos','proveedor']]){
  const payload={code:'BRM-ACCEPT-'+invoice+'-'+suffix,monto:'100.50',fecha:'05/11/2026',vencimiento:'05/11/2026',tipo:'factura',[party]:party==='cliente'?'Synthetic buyer':'Synthetic supplier',vendedor:'Synthetic seller'};
  const created=await api('/api/'+invoice+'/',{method:'POST',body:payload,token});assert.equal(created.status,200);assert.ok(created.body.response._id);documents.push({invoice,movement,code:payload.code,id:created.body.response._id});
  const key=crypto.randomUUID(),body={...payload,monto:'40.25',medioDePago:'efectivo'},first=await api('/api/'+movement+'/',{method:'POST',body,token,key}),replay=await api('/api/'+movement+'/',{method:'POST',body,token,key});assert.equal(first.status,200);assert.equal(replay.status,200);assert.equal(first.body.response._id,replay.body.response._id);
  const partial=(await api('/api/'+movement+'/',{token})).body.resultado.filter(x=>x.code===payload.code);assert.equal(partial.length,1);assert.equal(10050-partial.reduce((n,r)=>n+cents(r.monto),0),6025);add('BRM-'+movement+'-partial-retry-unique-and-debt-6025');
  const protectedEdit=await api('/api/'+invoice+'/'+created.body.response._id,{method:'PUT',body:{monto:'101.50'},token});assert.equal(protectedEdit.status,409);assert.equal((await api('/api/'+invoice+'/'+created.body.response._id,{method:'DELETE',token})).status,409);
  assert.equal((await api('/api/'+movement+'/',{method:'POST',body:{...body,monto:'60.25'},token,key:crypto.randomUUID()})).status,200);assert.equal((await api('/api/'+movement+'/',{method:'POST',body:{...body,monto:'0.01'},token,key:crypto.randomUUID()})).status,409);
  const rows=(await api('/api/'+movement+'/',{token})).body.resultado.filter(x=>x.code===payload.code);assert.equal(rows.length,2);assert.equal(rows.reduce((n,r)=>n+cents(r.monto),0),10050);add('BRM-'+movement+'-full-payment-overpayment-and-linked-document-protection');
 }
 const cheque={code:'BRM-CHEQUE-'+suffix,monto:'40.25',fecha:'05/11/2026',vencimiento:'05/11/2026',tipo:'cheque',cliente:'Synthetic cheque buyer'};
 const ch=await api('/api/cheque/',{method:'POST',body:cheque,token});assert.equal(ch.status,200);const chequeId=ch.body.response._id;
 for(const [invoice,party]of [['facturaCliente','cliente'],['facturaProveedor','proveedor']]){const d={code:'CHEQUE-'+invoice+'-'+suffix,monto:'100.50',fecha:'05/11/2026',tipo:'factura',[party]:party==='cliente'?cheque.cliente:'Synthetic supplier'};assert.equal((await api('/api/'+invoice+'/',{method:'POST',body:d,token})).status,200);const route=invoice==='facturaCliente'?'cobroCliente':'pagos';const body={...d,monto:'40.25',medioDePago:'cheque',cheque:chequeId};assert.equal((await api('/api/'+route+'/',{method:'POST',body,token,key:crypto.randomUUID()})).status,200);assert.equal((await api('/api/'+route+'/',{method:'POST',body,token,key:crypto.randomUUID()})).status,409);}add('BRM-cheque-one-receipt-one-delivery-no-reuse');
 const users=await api('/api/users/',{token});assert.equal(users.status,200);assert.ok(users.body.every(x=>!Object.hasOwn(x,'password')));add('BRM-users-never-return-password-material');
 for(const path of ['/chat','/socket.io/?EIO=4&transport=polling','/api/message'])assert.equal((await api(path,{token})).status,404);add('BRM-retired-messaging-not-exposed-even-to-admin');
 console.log(JSON.stringify({status:'approved',productionReady:false,scope:'actual BRM candidate API and isolated replica-set restored copy; synthetic new writes only; no live public API',cases,documents,counts:{approved:cases.length,failed:0}},null,2));
})().catch(e=>{console.error(e.stack);process.exitCode=1;}).finally(async()=>{await dbClient?.close();});
