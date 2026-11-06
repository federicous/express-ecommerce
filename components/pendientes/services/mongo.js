const Pending = require('../../../schema/pendientes');
const Sale = require('../../../schema/facturaClientes');

// D05b: operational follow-up only. No stock, collection or balance mutation.
// Legacy records remain readable and are not silently promoted to this lifecycle.
class MongoDB {
  async save(input) {
    const allowed = new Set(['code', 'cliente', 'listaProductos', 'fecha',
      'detalle', 'vendedor', 'ferreteria', 'name']);
    if (!input || typeof input !== 'object' || Array.isArray(input)
      || Object.keys(input).some((field) => !allowed.has(field))
      || !['code', 'cliente', 'listaProductos', 'fecha'].every((field) =>
        typeof input[field] === 'string' && input[field].trim())) {
      return { error: 'invalid_pending' };
    }
    const [day, month, year] = input.fecha.trim().split('/').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input.fecha.trim())
      || date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month
      || date.getUTCDate() !== day) return { error: 'invalid_pending' };
    const code = input.code.trim();
    const sales = await Sale.find({ code }).limit(2).lean();
    if (!sales.length) return { error: 'reference_not_found' };
    if (sales.length !== 1) return { error: 'ambiguous_reference' };
    const sale = sales[0];
    if (typeof sale.cliente !== 'string' || !sale.cliente.trim()
      || input.cliente.trim() !== sale.cliente.trim()) return { error: 'reference_mismatch' };
    const saved = await new Pending({
      code, cliente: sale.cliente, invoiceId: String(sale._id),
      listaProductos: input.listaProductos.trim(), fecha: input.fecha.trim(),
      detalle: typeof input.detalle === 'string' ? input.detalle.trim() : '',
      vendedor: sale.vendedor || '', ferreteria: sale.ferreteria || '',
      name: sale.name || '', estado: 'pendiente', trackingVersion: 'd05b',
      timestamp: Date.now(),
    }).save();
    return { resultado: saved, message: 'Seguimiento operativo registrado' };
  }

  async getAll() {
    return { resultado: await Pending.find({}) };
  }
}

module.exports = MongoDB;
