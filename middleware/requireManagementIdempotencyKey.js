const UUID_V4_OR_OTHER = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

module.exports = function requireManagementIdempotencyKey(req, res, next) {
  const key = req.get('Idempotency-Key');
  // Preserve existing B2B callers that have not adopted the retry contract.
  // Their controller assigns a one-request key; only callers that retain and
  // resend a key receive replay protection across requests.
  if (key === undefined) return next();
  if (typeof key !== 'string' || !UUID_V4_OR_OTHER.test(key)) {
    return res.status(400).json({ error: 'idempotency_key_required',
      message: 'No se recibió una identidad segura para esta operación. Volvé a iniciar el movimiento.' });
  }
  return next();
};
