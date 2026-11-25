const JWT = require("../utils/jwt/jwt");
const pino = require('../utils/logger/pino');
const UsuarioModel = require('../schema/usuarios');

const flagOn = value => value === true || value === 'true' || value === 'on';

function extractToken(req) {
	if (req.cookies && req.cookies.token) return req.cookies.token;
	const authHeader = req.headers?.authorization || req.headers?.Authorization;
	if (authHeader) {
		const parts = authHeader.split(' ');
		if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
		return authHeader;
	}
	if (req.headers?.token) return req.headers.token;
	if (req.query?.token) return req.query.token;
	return null;
}

async function verifiedCredentials(req) {
  const rawCookieTokens = String(req.headers?.cookie || '').split(';').map(v=>v.trim()).filter(v=>v.startsWith('token=')).map(v=>{try{return decodeURIComponent(v.slice(6));}catch(_){return v.slice(6);}});
  if (new Set(rawCookieTokens).size > 1) return { error: 'Credenciales contradictorias', code: 'credential_conflict' };
  const token = extractToken(req);
  if (!token) return { error: 'Token no provisto' };
  const payload = await JWT.verify(token);
  if (!payload) return { error: 'Token inválido' };
  const header = req.headers?.authorization || req.headers?.Authorization;
  const supplied = [req.cookies?.token, req.headers?.token, req.query?.token];
  if (header) {
    const parts = typeof header === 'string' ? header.split(' ') : [];
    supplied.push(parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] : header);
  }
  for (const credential of supplied.filter(value => value !== undefined && value !== null && value !== '')) {
    if (credential === token) continue;
    const other = typeof credential === 'string' ? await JWT.verify(credential) : null;
    if (!other || typeof payload.id !== 'string' || !payload.id || other.id !== payload.id) {
      return { error: 'Credenciales contradictorias', code: 'credential_conflict' };
    }
  }
  return { payload };
}

class Autenticacion {
	async usuario(req, res, next) {
		try {
			const { payload, error, code } = await verifiedCredentials(req);
			if (error) return res.status(401).json({ error, ...(code ? { code } : {}) });
			// A rejected request may predate a renewed browser session. Do not
			// send cookie deletion headers from an asynchronous authentication check.
			req.user = payload;
			next();
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`);
			return res.status(401).json({ error: 'Error de autenticación' });
		}
	}

	async administrador(req, res, next) {
		try {
			const { payload, error, code } = await verifiedCredentials(req);
			if (error) return res.status(401).json({ error, ...(code ? { code } : {}) });
			const isAdmin = payload && (payload.isAdmin === true || payload.isAdmin === 'true' || payload.isAdmin === 'on');
			if (!isAdmin || payload.storefrontOnly === true) {
				return res.status(403).json({ error: 'Acceso no autorizado: requiere rol administrador' });
			}
			req.user = payload;
			next();
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`);
			return res.status(401).json({ error: 'Error de autenticación' });
		}
	}

	async gestion(req, res, next) {
		try {
			const { payload, error, code } = await verifiedCredentials(req);
			if (error) return res.status(401).json({ error, ...(code ? { code } : {}) });
			const user = await UsuarioModel.findById(payload.id).select('enable isManagement').lean();
			if (!user || !flagOn(user.enable)) {
				return res.status(403).json({ error: 'La cuenta no está habilitada', code: 'account_disabled' });
			}
			// A storefront-only token cannot acquire privileged access after a role change.
			if (payload.storefrontOnly === true || !flagOn(user.isManagement)) {
				return res.status(403).json({ error: 'Acceso no autorizado: requiere permiso de gestión', code: 'management_forbidden' });
			}
			req.user = { ...payload, isManagement: true };
			next();
		} catch (error) {
			pino.error(`Error al validar acceso de gestión: ${error}`);
			return res.status(401).json({ error: 'No se pudo validar el acceso' });
		}
	}
}

module.exports = new Autenticacion();

module.exports.verifiedCredentials = verifiedCredentials;
