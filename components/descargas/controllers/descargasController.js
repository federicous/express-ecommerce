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

    async deleteFile(req, res, next) {
        try {
            const nombreArchivo = req.params.archivo;
            const filePath = path.resolve(`uploads/listas-descargar/${nombreArchivo}`)
            const fileName = path.basename(filePath);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error al eliminar archivo');
                } else {
                    res.send(`El archivo ${nombreArchivo} ha sido eliminado exitosamente`);
                }
            });
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(500).send('Error interno del servidor');
        }
    }

    async uploadList(req, res, next){
        try {
            pino.info(`######### Subiendo lista ${req.body.lista} ###### `)
            let element = req.body;
            let listName= req.listName;
            res.status(200).json({
                result:'ok',
                new: req.body,
                response: {listName},
            })
        } catch (error) {
            pino.error(`Se produjo un error: ${error}`);
            res.status(400).render('error');
        }
    }
}

module.exports = new Element();