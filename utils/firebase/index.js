
let admin = require("firebase-admin");

let serviceAccount = require("./config/express-ecommerce-536bd-firebase-adminsdk-6eftd-c2517040e6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseDB = admin.firestore();

module.exports = { firebaseDB };