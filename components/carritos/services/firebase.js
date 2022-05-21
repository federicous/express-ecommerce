// let { firebaseDB } = require("../../utils/firebase");
let { firebaseDB } = require("../../../utils/firebase");
let elementos= firebaseDB.collection('carritos');
// import { doc, getDoc } from "firebase/firestore";
const pino = require('../../../utils/logger/pino')

const { v4 } = require('uuid');

class FirebaseDB {

	async save() {
		try {
			let element={}
			element.id=v4();
			element.timestamp = Date.now();    
			element.lista=[];
			let newElement = await elementos.doc().set(element);
			return(element)
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}
	async modify(element,id) {
		try {
			let modifyElement=await elementos.doc(`${id}`).update(element);
			// let modifyElement = await firebaseDB.getDoc(doc(db, 'productos',`${id}` ))
			return(modifyElement)

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getById(id) {
		try {
			// let getElement = await elementos.where('id', '==', `${id}` ).get();
			// let getElement = await elementos.where('id', '==', `a73c7e06-0879-4624-912b-15c646c48213` ).get()

			let getElement = await elementos.doc(`${id}`).get();
			// let modifyElement = await firebaseDB.getDoc(firebaseDB.doc(firebaseDB, 'productos',`${id}`));

			return(getElement.data())
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async getAll() {
		try {
			let allElements= await elementos.get();
			let docsElements = allElements.docs;
			let dataElements = docsElements.map((documento) => documento.data());
			pino.info(dataElements);
			return(dataElements)			
			
		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}	
	}

	async deleteById(id) {
		try {
			let deleteElement=await elementos.doc(`${id}`).delete();

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}		
	}

	async deleteAll() {
		try {
			let deleteAllElement=await elementos.doc().delete();

			// let allElements= await elementos.get();
			// let docsElements = allElements.docs;
			// let dataElements = docsElements.map((documento) => documento.delete());

		} catch (error) {
			pino.error(`Se produjo un error: ${error}`)
			
		}
	}
}

module.exports= FirebaseDB;





