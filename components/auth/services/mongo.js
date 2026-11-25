let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const { loginSessionPolicy } = require('../../../utils/sessionLifetime');
const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');

class AuthService {

	async createUser(input, avatar) {
    if (!input || typeof input !== 'object' || Array.isArray(input)
      || typeof input.email !== 'string' || !input.email.trim()) {
      throw Object.assign(new Error('Datos de registro inválidos'), { status: 400 });
    }
    const { publicUser, passwordChange } = require('../../usuarios/services/publicUser');
    const allowed = ['name','age','email','address','phone','provincia','localidad','cuit','ferreteria','vendedor'];
    const user = {};
    for (const field of allowed) if (Object.hasOwn(input, field)) {
      if (typeof input[field] !== 'string' && typeof input[field] !== 'number') {
        throw Object.assign(new Error('Datos de registro inválidos'), { status: 400 });
      }
      user[field] = input[field];
    }
    user.email = input.email.trim().toLowerCase();
    const password = passwordChange(input.password, true);
    if (await UsuarioModel.findOne({ email: user.email })) return { message: 'Ya existe una cuenta con el mismo email' };
    const saved = await new UsuarioModel({ ...user, password: bcrypt.hashSync(password, 10),
      enable: 'off', isAdmin: 'off', isSeller: 'off', categoriaCliente: 'minorista',
      timestamp: Date.now(), avatar }).save();
    pino.info('Usuario creado pendiente de aprobación');
    return { id: saved._id, ...publicUser(saved), message: '' };
  }

	async login(email, password) {
		try {
			let user = await UsuarioModel.findOne({
				email: String(email || '').trim().toLowerCase()
			});
			// pino.info(user);
			if (!user) {
				pino.error(`NO EXISTE EL USUARIO ${email}`);
				return ({
					code: 'INVALID_CREDENTIALS',
					message: 'El correo o la contraseña no son correctos.'
				})
			} else if (bcrypt.compareSync(password, user.password)) {
				const isEnabled = user.enable === true
					|| user.enable === 'true'
					|| user.enable === 'on';
				if (!isEnabled) {
					pino.error(`USUARIO NO HABILITADO: ${email}`);
					return ({
						code: 'ACCOUNT_PENDING',
						message: 'Tu cuenta todavía está pendiente de aprobación.'
					})
				}
				let ID = user._id ? user._id : user.id;
				const { storefrontOnly, maxAgeSeconds } = loginSessionPolicy(user);
				const token = await JWT.generate({
					...(storefrontOnly ? { storefrontOnly: true } : {}),
					id: ID,
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
					isManagement: user.isManagement,
					vendedor: user.vendedor,
					descargas: user.descargas,
					descuento: user.descuento,
					categoriaCliente: user.categoriaCliente || 'mayorista',
					// El carrito y la orden necesitan estos datos para conservar la
					// dirección del comprador y el estado de la operación.
					address: user.address,
					state: user.state || 'pending',
					// IdVendedor: user.IdVendedor,
				}, maxAgeSeconds)
				return ({
					email: user.email,
					IdVendedor: user.IdVendedor || "",
					sessionMaxAgeSeconds: maxAgeSeconds,
					token
				})
			} else {
				pino.error(`CONTRASEÑA INCORRECTA PARA USUARIO: ${email}`);
				return ({
					code: 'INVALID_CREDENTIALS',
					message: 'El correo o la contraseña no son correctos.'
				})
			}
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

}

module.exports = AuthService;
