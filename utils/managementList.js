const pino = require('./logger/pino');

async function managementList(service, _req, res) {
  res.set('Cache-Control', 'no-store');
  try {
    const outcome = await service.getAll();
    if (!outcome || !Array.isArray(outcome.resultado) || outcome.error) {
      throw new Error('El servicio de gestión no confirmó una lista válida');
    }
    // Preserve the successful legacy envelope, including an explicitly empty list.
    return res.status(200).json(outcome);
  } catch (error) {
    pino.error(`Error de lectura de gestión: ${error}`);
    return res.status(500).json({ error: 'internal_error', message: 'No se pudo consultar la lista' });
  }
}

module.exports = managementList;
