// Liveness stays /health. Readiness never returns DB addresses or driver errors.
function createReadinessHandler({ connection, managementEnabled, timeoutMs = 1000 }) {
  return async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    if (connection.readyState !== 1 || !connection.db) return res.status(503).json({ status: 'not_ready' });
    let timer;
    try {
      const check = connection.db.admin().command({ hello: 1 }, { maxTimeMS: timeoutMs });
      const hello = await Promise.race([check, new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('readiness timeout')), timeoutMs);
      })]);
      // The first management stage requires a writable replica set. This check
      // is not an actual business transaction or a durability certification.
      const writable = hello.isWritablePrimary === true || hello.ismaster === true;
      if (!writable || (managementEnabled && !hello.setName)) return res.status(503).json({ status: 'not_ready' });
      return res.status(200).json({ status: 'ready' });
    } catch (_) {
      return res.status(503).json({ status: 'not_ready' });
    } finally {
      clearTimeout(timer);
    }
  };
}
module.exports = { createReadinessHandler };
