const Return = require('../../../schema/devoluciones');
const Sale = require('../../../schema/facturaClientes');

// D05a: a return is a traceable pending record, not a monetary adjustment.
// Historical records are deliberately left untouched and remain readable.
class MongoDB {
  async save(input) {
    const allowed = new Set(['code', 'cliente', 'codigoProducto', 'detalle', 'fecha',
      'vendedor', 'ferreteria', 'name']);
    if (!input || typeof input !== 'object' || Array.isArray(input)
      || Object.keys(input).some((field) => !allowed.has(field))
      || !['code', 'cliente', 'codigoProducto', 'detalle', 'fecha'].every((field) =>
        typeof input[field] === 'string' && input[field].trim())) {
      return { error: 'invalid_return' };
    }
    const [day, month, year] = input.fecha.trim().split('/').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(input.fecha.trim())
      || date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month
      || date.getUTCDate() !== day) return { error: 'invalid_return' };
    const code = input.code.trim();
    const sales = await Sale.find({ code }).limit(2).lean();
    if (!sales.length) return { error: 'reference_not_found' };
    if (sales.length !== 1) return { error: 'ambiguous_reference' };
    const sale = sales[0];
    if (typeof sale.cliente !== 'string' || !sale.cliente.trim()
      || input.cliente.trim() !== sale.cliente.trim()) return { error: 'reference_mismatch' };
    const entry = {
      code, cliente: sale.cliente, invoiceId: String(sale._id),
      codigoProducto: input.codigoProducto.trim(), detalle: input.detalle.trim(),
      fecha: input.fecha.trim(), vendedor: sale.vendedor || '',
      ferreteria: sale.ferreteria || '', name: sale.name || '',
      reconciliationStatus: 'pending', timestamp: Date.now(),
    };
    const saved = await new Return(entry).save();
    return { resultado: saved, message: 'Devolución registrada pendiente de conciliación' };
  }

  async getAll() {
    return { resultado: await Return.find({}) };
  }
}

module.exports = MongoDB;
