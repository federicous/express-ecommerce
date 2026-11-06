function session(req, res) {
  if (!req.user) {
    return res.status(401).json({ authenticated: false });
  }

  const { id, name, email, isAdmin, vendedor, descuento, categoriaCliente } = req.user;
  return res.status(200).json({
    authenticated: true,
    user: {
      id,
      name,
      email,
      isAdmin,
      vendedor,
      descuento,
      categoriaCliente: categoriaCliente || 'mayorista',
    },
  });
}

module.exports = session;
