function health(req, res) {
  const clientSlug = process.env.CLIENT_SLUG || 'cliente-local';

  return res.status(200).json({
    status: 'ok',
    service: `${clientSlug}-api`,
    timestamp: new Date().toISOString(),
  });
}

module.exports = health;
