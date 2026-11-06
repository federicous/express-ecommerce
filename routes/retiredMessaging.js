// Preserve legacy source/data, but never publish its global history/write channel.
// No feature flag can silently reopen it. A future chat needs a separate policy/review.
module.exports = function retiredMessaging(app) {
  app.use(['/socket.io', '/api/message', '/home', '/chat'], (_req, res) => {
    res.set('Cache-Control', 'no-store');
    return res.status(404).json({ code: 'LEGACY_MESSAGING_DISABLED', error: 'La mensajería heredada no está disponible en esta etapa.' });
  });
};
