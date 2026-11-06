const mongoose = require('mongoose');

// `_id` is the durable operation key, so Mongo's built-in unique index is the
// idempotency claim shared by every backend process. Rows deliberately have no TTL.
const schema = new mongoose.Schema({
  _id: { type: String, required: true },
  resource: { type: String, required: true },
  actor: { type: String, required: true },
  fingerprint: { type: String, required: true },
  movementId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, required: true },
}, { versionKey: false, collection: 'managementMovementAttempts' });

module.exports = mongoose.models.managementMovementAttempt
  || mongoose.model('managementMovementAttempt', schema);
