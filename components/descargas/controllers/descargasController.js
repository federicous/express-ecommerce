const JWT = require("../../../utils/jwt/jwt");
const pino = require('../../../utils/logger/pino');
let path = require('path');
const fs = require('fs');
const folderPath = path.resolve('uploads/listas-descargar/');

class Element {

    // async getFile(req, res, next){
    //     try {
    //         console.log(`Descargando archivo`);
    //         // res.sendFile(__dirname + '/../../../uploads/listas-descargar/BREMEN Gral. Enero 23.xlsx');
    //         res.sendFile(path.resolve('uploads/listas-descargar/BREMEN Gral. Enero 23.xlsx'));


    //     } catch (error) {
    //         pino.error(`Se produjo un error: ${error}`);
    //     }
    // }
    // async getFile(req, res, next){
    //     try {
    //         let archivo = req.params.archivo
    //         console.log(`Descargando archivo`);
    //         // res.sendFile(__dirname + '/../../../uploads/listas-descargar/BREMEN Gral. Enero 23.xlsx');
    //         // res.sendFile(path.resolve('uploads/listas-descargar/BREMEN Gral. Enero 23.xlsx'));

    //         const archivoPath = path.resolve('uploads/listas-descargar/BREMEN Gral. Enero 23.xlsx')
    //         const nombreArchivo = path.basename(archivoPath);
    //         const tipoArchivo = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    //         res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    //         res.setHeader('Content-Type', tipoArchivo);
    //         res.sendFile(archivoPath);

    //     } catch (error) {
    //         pino.error(`Se produjo un error: ${error}`);
    //     }
    // }

    async getFile(req, res, next) {
        try {
            let archivo = req.params.archivo
            const filePath = path.resolve(`uploads/listas-descargar/${archivo}`)
            const fileName = path.basename(filePath);
            // Configurar los encabezados de respuesta para indicar que se trata de un archivo descargable
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            // Leer el archivo y enviar los datos al cliente
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(500).send('Error interno del servidor');
        }
    }

    async getFileList(req, res, next) {
        try {
            await fs.readdir(folderPath, (err, files) => {
                if (err) throw err;
                console.log(files);
                res.send(files)
            });

        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
        }
    }
}

module.exports = new Element();