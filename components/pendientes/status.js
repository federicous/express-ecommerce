const mongoose = require('mongoose');
const Pending = require('../../schema/pendientes');
const pino = require('../../utils/logger/pino');

function reject(res, status, error, message) {
  return res.status(status).json({ error, message });
}

async function finish(req, res) {
  const { id } = req.params;
  if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id) || !mongoose.isValidObjectId(id)) {
    return reject(res, 400, 'invalid_id', 'El identificador no es válido');
  }
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)
    || Object.keys(req.body).length !== 1 || req.body.estado !== 'finalizado') {
    return reject(res, 400, 'invalid_pending_status', 'Solo se puede finalizar el seguimiento operativo');
  }
  const actor = req.user?.id;
  if (typeof actor !== 'string' || !actor.trim()) {
    return reject(res, 403, 'invalid_actor', 'La sesión no identifica al administrador');
  }
  try {
    const current = await Pending.findById(id).lean();
    if (!current) return reject(res, 404, 'not_found', 'No existe el pendiente');
    if (current.trackingVersion !== 'd05b') {
      return reject(res, 409, 'historical_pending_unverified', 'El pendiente anterior requiere revisión antes de cambiar estado');
    }
    if (current.estado !== 'pendiente') {
      return reject(res, 409, 'pending_already_finished', 'El seguimiento ya está finalizado');
    }
    // CAS prevents two sequential or concurrent completions from both succeeding.
    const saved = await Pending.findOneAndUpdate(
      { _id: current._id, trackingVersion: 'd05b', estado: 'pendiente' },
      { $set: { estado: 'finalizado', statusChangedAt: new Date().toISOString(),
        statusChangedBy: actor.trim() } },
      { new: true, runValidators: true },
    );
    if (!saved) return reject(res, 409, 'stale_pending', 'El pendiente cambió; recargá la lista');
    return res.status(200).json({ result: 'ok', response: saved });
  } catch (error) {
    pino.error(`Error finalizando pendiente: ${error}`);
    return reject(res, 500, 'internal_error', 'No se pudo cambiar el estado');
  }
}

module.exports = { finish };
