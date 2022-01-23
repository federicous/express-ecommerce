let { firebaseDB } = require("../utils/firebase");
let elementos= firebaseDB.collection('mensajes');
// import { doc, getDoc } from "firebase/firestore";

const { v4 } = require('uuid');

class FirebaseDB {

	async save(element) {
		try {
			element.id=v4();
			element.timestamp = Date.now();    
			await elementos.doc().set(element);
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}
	}
	async modify(element,id) {
		try {
			let modifyElement=await elementos.doc(`${id}`).update(element);
			return(modifyElement)

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getById(id) {
		try {
			let getElement = await elementos.doc(`${id}`).get();

			return(getElement.data())
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async getAll() {
		try {
			let allElements= await elementos.get();
			let docsElements = allElements.docs;
			let dataElements = docsElements.map((documento) => documento.data());
			console.log(dataElements);
			return(dataElements)			
			
		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}	
	}

	async deleteById(id) {
		try {
			let deleteElement=await elementos.doc(`${id}`).delete();

		} catch (error) {
			console.log(`Error de lectura`, error);
			throw new Error(error)
		}		
	}

	async deleteAll() {
		try {
			let deleteAllElement=await elementos.doc().delete();

			// let allElements= await elementos.get();
			// let docsElements = allElements.docs;
			// let dataElements = docsElements.map((documento) => documento.delete());

		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports= FirebaseDB;















