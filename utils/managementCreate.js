const fs = require('node:fs/promises');
const pino = require('./logger/pino');

async function removeRejectedUpload(req) {
  if (req.file?.path) await fs.unlink(req.file.path);
}

// Conserva el envelope de éxito legacy, pero nunca confirma un alta sin resultado.
async function managementCreate(service, req, res) {
  try {
    const outcome = await service.save(req.body);
    const rejections = {
      idempotency_key_required: [400, 'No se recibió una identidad segura para esta operación'],
      invalid_idempotency_key: [400, 'No se pudo identificar este intento; recargá y volvé a iniciar la operación'],
      idempotency_actor_required: [400, 'No se pudo identificar la sesión que inicia el movimiento'],
      idempotency_conflict: [409, 'Este intento ya fue utilizado con datos distintos. Iniciá una operación nueva'],
      idempotency_record_inconsistent: [409, 'El intento anterior requiere revisión antes de continuar'],
      atomicity_unavailable: [503, 'No se puede registrar el movimiento: la base necesita soporte transaccional'],
      duplicate_code: [409, 'Ya existe un registro con ese código'],
      reference_not_found: [422, 'No existe el comprobante asociado'],
      ambiguous_reference: [409, 'El código corresponde a más de un comprobante; no se pudo vincular el movimiento'],
      reference_mismatch: [409, 'La persona no coincide con el comprobante asociado'],
      invalid_return: [400, 'Completá producto, detalle y fecha válida; no se admite importe ni estado de conciliación en esta etapa'],
      invalid_pending: [400, 'Completá productos, cliente y fecha válida; el estado se asigna en el servidor y no modifica saldos'],
      invalid_reference: [400, 'La referencia del comprobante no es válida'],
      invalid_payload: [400, 'Los datos del alta no son válidos'],
      invalid_date: [400, 'Ingresá una fecha válida en formato DD/MM/AAAA'],
      invalid_amount: [400, 'El importe debe ser positivo y tener como máximo dos decimales'],
      invalid_existing_balance: [409, 'El saldo existente requiere revisión antes de registrar otro movimiento'],
      amount_exceeds_balance: [409, 'El importe supera el saldo pendiente del comprobante'],
      invalid_cheque_reference: [400, 'Seleccioná un cheque válido para este medio de pago'],
      invalid_cheque_record: [400, 'El cheque necesita cliente, tipo e importe válidos'],
      cheque_history_unverified: [409, 'Este cheque histórico necesita conciliación antes de usarse'],
      cheque_not_found: [422, 'No existe el cheque seleccionado'],
      ambiguous_cheque: [409, 'La referencia del cheque requiere revisión'],
      cheque_type_mismatch: [409, 'El tipo del cheque no coincide con el medio de pago'],
      cheque_amount_mismatch: [409, 'El importe del cheque no coincide con el movimiento'],
      cheque_party_mismatch: [409, 'El cheque no corresponde al cliente de la venta'],
      cheque_already_used: [409, 'El cheque ya fue aplicado en esta etapa'],
      cheque_not_received: [409, 'El cheque debe constar en un cobro antes de entregarlo'],
    };
    const rejection = rejections[outcome?.error] || null;
    if (rejection) {
      await removeRejectedUpload(req);
      return res.status(rejection[0]).json({
        error: outcome.error,
        message: rejection[1],
      });
    }
    if (!outcome?.resultado || outcome.error) {
      throw new Error('El servicio de gestión no confirmó la persistencia');
    }
    const responseBody = { ...(req.body || {}) };
    delete responseBody.idempotencyKey;
    delete responseBody.idempotencyActor;
    return res.status(200).json({
      result: 'ok',
      new: responseBody,
      response: outcome.resultado,
      ...(outcome.idempotentReplay ? { idempotentReplay: true } : {}),
    });
  } catch (error) {
    pino.error(`Error de alta de gestión: ${error}`);
    const validation = error?.name === 'ValidationError' || error?.name === 'CastError';
    const duplicate = error?.code === 11000;
    if (validation || duplicate) {
      try {
        await removeRejectedUpload(req);
      } catch (cleanupError) {
        pino.error(`Error limpiando subida rechazada: ${cleanupError}`);
        return res.status(500).json({ error: 'internal_error', message: 'No se pudo completar el alta' });
      }
    }
    return res.status(validation ? 400 : duplicate ? 409 : 500).json({
      error: validation ? 'validation_error' : duplicate ? 'duplicate_code' : 'internal_error',
      message: validation ? 'Los datos del alta no son válidos'
        : duplicate ? 'Ya existe un registro con ese código' : 'No se pudo completar el alta',
    });
  }
}

module.exports = managementCreate;
