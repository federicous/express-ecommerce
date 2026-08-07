const configuracionService = require("../services/configuracionService");
const pino = require("../../../utils/logger/pino");

class ConfiguracionController {
    async getPublicPrices(req, res) {
        try {
            const config = await configuracionService.getPublicPricesConfig();
            res.status(200).json(config);
        } catch (error) {
            pino.error(`Error en getPublicPrices: ${error}`);
            res.status(500).json({ error: "Error al consultar la configuración" });
        }
    }

    async setPublicPrices(req, res) {
        try {
            const { mostrarPreciosPublicos } = req.body;
            const config = await configuracionService.setPublicPricesConfig(mostrarPreciosPublicos);
            res.status(200).json(config);
        } catch (error) {
            pino.error(`Error en setPublicPrices: ${error}`);
            res.status(500).json({ error: "Error al guardar la configuración" });
        }
    }
}

module.exports = new ConfiguracionController();
