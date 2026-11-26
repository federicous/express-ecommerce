'use strict';
const { parseAdminListInput } = require('./admin-list-input');

function createAdminOrderListHandler(Order, ObjectId) {
  return async (req, res) => {
    let input;
    try { input = parseAdminListInput(req.query); }
    catch (_) { return res.status(400).json({ message: 'Filtros inválidos' }); }
    try {
      const match = {};
      const andClauses = [];
      if (input.id) match._id = new ObjectId(input.id);
      if (input.before) match._id = { ...(input.id ? { $eq: new ObjectId(input.id) } : {}), $lt: new ObjectId(input.before) };
      if (input.email) match.email = { $regex: input.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      if (input.type === 'quote') {
        andClauses.push({ presupuesto: { $exists: true, $nin: ['', null, false] } });
      } else if (input.type === 'order') {
        andClauses.push({ $or: [{ presupuesto: { $exists: false } }, { presupuesto: { $in: ['', null, false] } }] });
      }
      if (input.notificationStatus === 'unavailable') {
        andClauses.push({ $or: [{ 'notification.status': { $exists: false } }, { 'notification.status': { $in: [null, '', 'unavailable'] } }] });
      } else if (input.notificationStatus) {
        andClauses.push({ 'notification.status': input.notificationStatus });
      }
      if (andClauses.length) match.$and = andClauses;
      const pipeline = [{ $match: match }];
      if (input.from || input.to) {
        // Legacy orders can store epoch milliseconds as numbers or strings.
        pipeline.push({ $addFields: { _orderTime: { $convert: { input: '$timestamp', to: 'long', onError: null, onNull: null } } } });
        const range = {};
        if (input.from) range.$gte = Date.parse(input.from + 'T00:00:00-03:00');
        if (input.to) range.$lt = Date.parse(input.to + 'T00:00:00-03:00') + 86400000;
        pipeline.push({ $match: { _orderTime: range } });
      }
      pipeline.push({ $sort: { _id: -1 } }, { $limit: input.limit + 1 }, { $project: { email: 1, timestamp: 1, presupuesto: 1, 'notification.status': 1, productCount: { $size: { $ifNull: ['$productList', []] } } } });
      const docs = await Order.aggregate(pipeline);
      const hasMore = docs.length > input.limit, page = docs.slice(0, input.limit);
      return res.json({ orders: page.map(o => ({ id: String(o._id), email: o.email, timestamp: o.timestamp, presupuesto: !!o.presupuesto, productCount: o.productCount, notificationStatus: o.notification?.status || 'unavailable' })), nextCursor: hasMore ? String(page[page.length - 1]._id) : null });
    } catch (_) { return res.status(500).json({ message: 'No se pudieron consultar los pedidos' }); }
  };
}
module.exports = { createAdminOrderListHandler };
