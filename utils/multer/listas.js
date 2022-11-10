const multer = require("multer");
let path = require("path");
const pino = require('../../utils/logger/pino');

let uploadPath = path.join(__dirname, '../../uploads/listas');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `${uploadPath}`)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, file.fieldname + '-' + uniqueSuffix  + '-' + file.originalname)
		req.listName = file.fieldname + '-' + uniqueSuffix  + '-' + file.originalname
	},

})

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		// if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
		if (true) {
			cb(null, true);
		} else {
			cb(null, false);
			pino.error(`Se produjo un error: Only .png, .jpg and .jpeg format allowed!`);
			return;
		}
	}
})

module.exports = upload;