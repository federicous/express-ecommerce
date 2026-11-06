const { loadSharedCookieScope } = require('./sharedCookieScope');
const isProduction = process.env.NODE_ENV === 'production';

function authCookieOptions(maxAge) {
  const options = {
    path: '/',
    secure: isProduction,
    sameSite: 'lax',
  };

  // A production deployment may serve the catalog and administrator from
  // sibling subdomains (for example, almafer.com.ar and
  // admin.almafer.com.ar).  Sharing the auth cookie is opt-in so local
  // clients and other deployments keep host-only cookies by default.
  const policy = loadSharedCookieScope();
  if (policy) options.domain = '.' + policy.domain;

  if (typeof maxAge === 'number') options.maxAge = maxAge;
  return options;
}

module.exports = { authCookieOptions };
