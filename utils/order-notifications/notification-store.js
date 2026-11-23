'use strict';
const { randomUUID } = require('crypto');
// Embedded outbox: the order and notification are created in one document.
function createStore(Order) {
  return {
    async claimDue(now) {
      const token = randomUUID();
      const job = await Order.findOneAndUpdate(
        { 'notification.status': 'pending', 'notification.nextAttemptAt': { $lte: now } },
        { $set: { 'notification.status': 'sending', 'notification.claimToken': token, 'notification.claimedAt': now }, $inc: { 'notification.attempts': 1, 'notification.totalAttempts': 1 } },
        { new: true, sort: { 'notification.nextAttemptAt': 1 } }
      ).select('+notification').lean();
      if (!job) return null;
      return { ...job.notification, orderId: job._id, claimToken: token };
    },
    async finish(job, update) {
      const fields = {};
      for (const [key, value] of Object.entries(update)) fields[`notification.${key}`] = value;
      const result = await Order.updateOne({ _id: job.orderId, 'notification.status': 'sending', 'notification.claimToken': job.claimToken }, { $set: fields, $unset: { 'notification.claimToken': '', 'notification.claimedAt': '' } });
      if (result.modifiedCount !== 1 && result.nModified !== 1) throw new Error('Notification claim was lost');
    },
    async recoverStale(before) {
      return Order.updateMany({ 'notification.status': 'sending', 'notification.claimedAt': { $lt: before } }, { $set: { 'notification.status': 'review', 'notification.lastError': 'Delivery outcome unknown after worker interruption' }, $unset: { 'notification.claimToken': '', 'notification.claimedAt': '' } });
    }
  };
}
module.exports = { createStore };
