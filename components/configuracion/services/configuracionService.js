const ConfiguracionModel = require("../../../schema/configuracion");

class ConfiguracionService {
    async getPublicPricesConfig() {
        try {
            const configObj = await ConfiguracionModel.findOne({ clave: 'mostrarPreciosPublicos' });
            return {
                mostrarPreciosPublicos: configObj ? Boolean(configObj.valor) : false
            };
        } catch (error) {
            console.error("Error al obtener configuracion mostrarPreciosPublicos:", error);
            return { mostrarPreciosPublicos: false };
        }
    }

    async setPublicPricesConfig(mostrarPreciosPublicos) {
        try {
            const valor = Boolean(mostrarPreciosPublicos);
            const configObj = await ConfiguracionModel.findOneAndUpdate(
                { clave: 'mostrarPreciosPublicos' },
                { valor: valor },
                { upsert: true, new: true }
            );
            return {
                mostrarPreciosPublicos: Boolean(configObj.valor)
            };
        } catch (error) {
            console.error("Error al guardar configuracion mostrarPreciosPublicos:", error);
            throw error;
        }
    }
}

module.exports = new ConfiguracionService();
