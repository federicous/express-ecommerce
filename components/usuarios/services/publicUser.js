// Public user responses never contain password material, including legacy fields.
function publicUser(user) {
  if (!user || typeof user !== "object") return user;
  const value = typeof user.toObject === 'function' ? user.toObject() : user;
  const { password, ...safe } = value;
  return safe;
}
function passwordChange(value, required = false) {
  if (value === undefined || value === '') {
    if (!required) return undefined;
    throw Object.assign(new Error('La contraseña es obligatoria'), { status: 400 });
  }
  if (typeof value !== 'string' || !value.trim() || /^\$2[aby]\$/.test(value) || Buffer.byteLength(value, 'utf8') > 72) {
    throw Object.assign(new Error('Contraseña inválida: use texto nuevo de hasta 72 bytes, no un hash'), { status: 400 });
  }
  return value;
}
module.exports = { publicUser, passwordChange };
