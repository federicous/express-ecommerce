const PRIVILEGED_SESSION_SECONDS = 60 * 60;
const STOREFRONT_SESSION_SECONDS = 8 * 60 * 60;
const isEnabledFlag = value => value === true || value === 'true' || value === 'on';

function loginSessionPolicy(user) {
  const storefrontOnly = !isEnabledFlag(user.isAdmin) && !isEnabledFlag(user.isManagement);
  return {
    storefrontOnly,
    maxAgeSeconds: storefrontOnly ? STOREFRONT_SESSION_SECONDS : PRIVILEGED_SESSION_SECONDS,
  };
}

module.exports = { PRIVILEGED_SESSION_SECONDS, STOREFRONT_SESSION_SECONDS, loginSessionPolicy };
