const { isIP } = require('node:net');
function origin(value) {
  const u = new URL(value);
  if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash || u.pathname !== '/') throw new Error('Shared auth requires exact HTTPS origins');
  return u;
}
function within(host, domain) { return host === domain || host.endsWith('.' + domain); }
function loadSharedCookieScope(env = process.env) {
  if (!env.AUTH_COOKIE_DOMAIN) return null;
  if (env.NODE_ENV !== 'production') throw new Error('Shared auth domain requires production cookie policy');
  const domain = env.AUTH_COOKIE_DOMAIN.trim().toLowerCase().replace(/^\./, '');
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/.test(domain) || isIP(domain)) throw new Error('Invalid shared auth domain');
  const publicUrl = origin(env.PUBLIC_URL), apiUrl = origin(env.API_URL);
  // A declared canonical client root is the authority. Never widen to one of
  // its ancestors (e.g. synthetic.test / com.ar) based on a suffix alone.
  if (![domain, 'www.' + domain].includes(publicUrl.hostname) || !within(apiUrl.hostname, domain)) throw new Error('Shared domain must match the declared client root and API');
  const origins = (env.CORS_ORIGINS || '').split(',').map(v => v.trim());
  if (!origins.length || origins.some(v => { const u = origin(v); return u.origin !== v || !within(u.hostname, domain); })) throw new Error('Shared auth CORS origins must belong to one client');
  return { domain, apiUrl, origins };
}
function browserLogoutScope(req, env = process.env) {
  const raw = req.get('Origin'); let u;
  try { u = new URL(raw); } catch (_) { return null; }
  let policy; try { policy = loadSharedCookieScope(env); } catch (_) { return null; }
  if (policy) {
    if (req.protocol !== 'https' || req.hostname !== policy.apiUrl.hostname || u.origin !== raw || !policy.origins.includes(raw)) return null;
    return { browserClear: true, scope: 'shared-domain-browser', cookieDomain: policy.domain };
  }
  if (!['http:', 'https:'].includes(u.protocol) || u.origin !== raw || u.hostname !== req.hostname || u.protocol !== req.protocol + ':') return null;
  return { browserClear: true, scope: 'same-host-browser' };
}
module.exports = { loadSharedCookieScope, browserLogoutScope };
