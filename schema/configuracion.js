const mongoose = require("mongoose");
let { Schema, model } = mongoose;

const configuracionSchema = new Schema({
    clave: { type: String, required: true, unique: true },
    valor: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });

let ConfiguracionModel = model('configuraciones', configuracionSchema);

module.exports = ConfiguracionModel;
