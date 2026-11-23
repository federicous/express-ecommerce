'use strict';
const crypto = require('crypto');
const {createNotification} = require('./create-notification');
// index on key must be unique; its value is scoped to the authenticated actor.
async function checkout({actor, key, target, budget, getCart, makeMail, insert, findExisting, clearCart}) {
  if (!actor || !actor.email || typeof key !== 'string' || !/^[a-zA-Z0-9-]{16,128}$/.test(key)) throw new Error('Invalid idempotency key');
  const scopedKey = crypto.createHash('sha256').update(actor.email.toLowerCase()+'\0'+key).digest('hex');
  const fingerprint = crypto.createHash('sha256').update(JSON.stringify({target: target ? {email:target.email || '', vendedor:target.vendedor || '', descuento:target.descuento ?? null, state:target.state ?? null} : {email:actor.email},budget:!!budget})).digest('hex');
  let existing = await findExisting(scopedKey);
  if (existing) {
    if (existing.requestFingerprint !== fingerprint) throw new Error('Idempotency key conflict');
    return {order:existing,replayed:true};
  }
  const cart = await getCart();
  if (!Array.isArray(cart) || !cart.length) throw new Error('Empty cart');
  const mail = await makeMail(cart);
  const notification = createNotification(mail);
  let order;
  try { order = await insert({cart,notification,scopedKey,fingerprint}); }
  catch (error) {
    if (error.code !== 11000) throw error;
    existing = await findExisting(scopedKey);
    if (!existing || existing.requestFingerprint !== fingerprint) throw error;
    return {order:existing,replayed:true};
  }
  if (!order || !order._id) throw new Error('Order was not saved');
  // Cleanup failure cannot invalidate an order already committed. The clearCart
  // implementation must compare the cart version so new additions are not lost.
  let cleanupPending = false;
  try { await clearCart(cart); } catch (_) { cleanupPending = true; }
  return {order,replayed:false,cleanupPending};
}
module.exports={checkout};
