'use strict';

// Never expose the contents or other recipients of the order notification.
function createOwnStatusHandler(Order, isValidId) {
  return async (req, res) => {
    const email = req.user && req.user.email;
    if (typeof email !== 'string' || !email || !isValidId(req.params.id)) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    try {
      const order = await Order.findOne({ _id: req.params.id, email }).select('+notification').lean();
      if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
      const notification = order.notification;
      if (!notification) return res.json({ status: 'unavailable' });
      const recipient = (notification.recipients || []).find(r => typeof r.address === 'string' && r.address.toLowerCase() === email.toLowerCase());
      if (!recipient) return res.json({ status: 'unavailable' });
      const status = recipient.status === 'accepted' ? 'accepted'
        : notification.status === 'review' || recipient.status === 'rejected' || recipient.status === 'unknown' ? 'review'
        : notification.status === 'sending' ? 'sending' : 'pending';
      return res.json({ status });
    } catch (_) {
      return res.status(500).json({ message: 'No se pudo consultar la notificación' });
    }
  };
}
module.exports = { createOwnStatusHandler };
