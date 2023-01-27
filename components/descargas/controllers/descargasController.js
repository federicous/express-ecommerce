const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');
let path = require('path');

class Element {

    async getFile(req, res, next){
        try {
            console.log(`Descargando archivo`);
            // res.sendFile(__dirname + '/../../../uploads/listas-descargar/BREMEN Gral. Enero 23.xlsx');
            res.sendFile(path.resolve('uploads/listas-descargar/BREMEN Gral. Enero 23.xlsx'));

            
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }
}

module.exports = new Element();