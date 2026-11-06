let {connection, mongoose} = require("../../../config/mongo");
let UsuarioModel = require('../../../schema/usuarios');
let bcrypt = require("bcryptjs");
const pino = require('../../../utils/logger/pino');
const { publicUser, passwordChange } = require('./publicUser');
function inputChanges(input, required = false) {
 if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(k=>k.startsWith('$')||k.includes('.'))) throw Object.assign(new Error('Datos de usuario inválidos'),{status:400});
 const output={};for(const key of ['name','age','email','address','phone','provincia','localidad','cuit','ferreteria','descuento','vendedor','IdVendedor','isAdmin','isSeller','enable','descargas'])if(Object.hasOwn(input,key)){if(input[key]!==null&&typeof input[key]==='object')throw Object.assign(new Error('Campo de usuario inválido'),{status:400});output[key]=input[key];}
 const password=passwordChange(input.password,required);if(password!==undefined)output.password=bcrypt.hashSync(password,10);return output;
}
function userId(id){if(typeof id!=='string'||!mongoose.isValidObjectId(id))throw Object.assign(new Error('Identidad de usuario inválida'),{status:400});return id;}

class MongoDB {

	async createUser(input,avatar) {
        const user=inputChanges(input,true);
        if(await UsuarioModel.findOne({email:user.email}))throw Object.assign(new Error('Ya existe una cuenta con el mismo email'),{status:409});
        const saved=await new UsuarioModel({...user,timestamp:Date.now(),avatar}).save();
        pino.info('Usuario registrado');
        return {id:saved._id,...publicUser(saved),message:'Usuario registrado'};
    }

	async modifyUser(input) {
        const id=userId(input?._id),update=inputChanges(input);
        const saved=await UsuarioModel.findOneAndUpdate({_id:id},{$set:update},{new:true});
        if(!saved)throw Object.assign(new Error('Usuario no encontrado'),{status:404});
        pino.info('Usuario modificado');
        return {message:'Usuario modificado',user:publicUser(saved)};
    }

	async deleteUser(usuario,avatar) {
		try {
			// console.log(usuario);
			
			// let user = await UsuarioModel.findOne({_id: usuario._id});
			// if (user) {
			// 	return ({message: 'Ya existe una cuenta con el mismo email'})
			// }
			if (usuario.password) {
				const passwordHash = bcrypt.hashSync(usuario.password, 10)
				usuario.password = passwordHash;
			}
			// usuario.timestamp = Date.now();
			// usuario.avatar= avatar;
			// let agregarUsuarioModel = new UsuarioModel(usuario);
			// let agregarUsuario = await agregarUsuarioModel.save();
			await UsuarioModel.deleteOne({_id: `${usuario._id}`})
			pino.info(usuario)
			return{message:`se ELIMINÓ el usuario ${usuario.email}`}
			// pino.info(agregarUsuario);
			// return {id: agregarUsuario._id, email:usuario.email, message:''}
			// return {id: agregarUsuario._id, ...usuario, message:''}

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
		}
	}

	async save(usuario) {
		try {
			const passwordHash = bcrypt.hashSync(usuario.password, 10)
			usuario.password = passwordHash;
			usuario.timestamp=Date.now();
			let agregarUsuarioModel= new UsuarioModel(usuario);
			let agregarUsuario = await agregarUsuarioModel.save();
			pino.info(agregarUsuario);		
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}
	}
	async modify(usuario,id) {
		try {
			let modificar = await UsuarioModel.findByIdAndUpdate(id, usuario);
			return(modificar)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let mostrar = await UsuarioModel.findById(userId(id)).select('-password');
			return(publicUser(mostrar))
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getByIdVendedor(id) {
		try {
			let regex = new RegExp('^' + id + '$', 'i')
			let mostrar = await UsuarioModel.find({IdVendedor:regex});
			// const mostrar = await UsuarioModel.findOne({ IdVendedor: new RegExp('^' + id + '$', 'i') });
			// console.log(`getByIdVendedor: ${regex}`);			
			// console.log(mostrar[0].email);
			return(mostrar[0]?.email || "")
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let allUsers = await UsuarioModel.find({}).select('-password');
			return(allUsers.map(publicUser))
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}	
	}

	async deleteById(id) {
		try {
			let borrar = await UsuarioModel.findByIdAndDelete(id);

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			throw new Error(error)
		}		
	}

	async deleteAll() {
		try {
			const contenido = await UsuarioModel.deleteMany({});

		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports= MongoDB;















