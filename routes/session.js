const UsuarioModel = require('../schema/usuarios');
const flagOn = value => value === true || value === 'true' || value === 'on';

function createSessionHandler(findUserById) {
  return async function session(req, res) {
    res.set('Cache-Control', 'no-store');
    if (!req.user) return res.status(401).json({ authenticated: false });
    try {
      const user = await findUserById(req.user.id);
      if (!user || !flagOn(user.enable)) return res.status(401).json({ authenticated: false });
      return res.status(200).json({
        authenticated: true,
        user: {
          id: String(user._id || req.user.id),
          name: user.name,
          email: user.email,
          isAdmin: req.user.storefrontOnly !== true && flagOn(user.isAdmin),
          isManagement: req.user.storefrontOnly !== true && flagOn(user.isManagement),
          vendedor: user.vendedor,
          descuento: user.descuento,
          categoriaCliente: user.categoriaCliente || 'mayorista',
        },
      });
    } catch (_) {
      return res.status(503).json({ authenticated: false, code: 'session_unavailable' });
    }
  };
}

const session = createSessionHandler(id => UsuarioModel.findById(id)
  .select('name email isAdmin isManagement enable vendedor descuento categoriaCliente')
  .lean());
module.exports = session;
module.exports.createSessionHandler = createSessionHandler;
