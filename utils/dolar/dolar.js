const axios = require('axios');
// let DolarModel = require('../../schema/dolar');
// const pino = require('../../utils/logger/pino');
// const elementService = require('../../components/dolar/services')

class ApiQuery {

  async get(url) {
    try {
      const configuration = {
        method: "get",
        url: `${url}`,
      };
      // make the API call
      let result = await axios(configuration)
      return (result.data);

    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ApiQuery;

let apiQuery = new ApiQuery();

// apiQuery.get(`https://www.bna.com.ar/Personas`)
//   .then((respuesta) => {
//     let busqueda = respuesta.split("\r\n");
//     let res = busqueda.findIndex(fila => /Dolar U.S.A/.test(fila));
//     let precioDolar = busqueda[res + 2].replace(',', '.').replace(/.*<td>/, '').replace(/<\/td>.*/, '');
//     console.log(precioDolar);
//   })

//   window.setInterval(function(){ // Set interval for checking
//     var date = new Date(); // Create a Date object to find out what time it is
//     if(date.getHours() === 8 && date.getMinutes() === 0){ // Check the time
//         // Do stuff
//     }
// }, 60000); // Repeat every 60000 milliseconds (1 minute)

// setInterval(async () => {

//   try {

//     let date = new Date();
//     // if (date.getHours() === 8 && date.getMinutes() === 0) { // Check the time
//     if (date.getHours() <= 11 && date.getDay() >= 1 && date.getDay() <= 5) { // si son las 11 y estamos entre lunes y viernes
//       // Do stuff
//       console.log(date.getDay());
//       console.log(`son las 11`);

//       pino.info(`actualizando precio del dolar `);
//       let agregarDolar = await DolarModel.find({
//         tipo: `bna`
//       })
//       console.log(`agregarDolar: ${agregarDolar}`);

//       let respuesta = await apiQuery.get(`https://www.bna.com.ar/Personas`)
//       let busqueda = respuesta.split("\r\n");
//       let res = busqueda.findIndex(fila => /Dolar U.S.A/.test(fila));
//       let precioDolar = busqueda[res + 2].replace(',', '.').replace(/.*<td>/, '').replace(/<\/td>.*/, '');
//       console.log(precioDolar);
//       let dolar = await elementService.postPrecio({
//         tipo: `bna`,
//         dolar: `131`
//       });



//       // apiQuery.get(`https://www.bna.com.ar/Personas`)
//       //   .then( async (respuesta) => {

//       //     try {

//       //       let busqueda = respuesta.split("\r\n");
//       //       let res = busqueda.findIndex(fila => /Dolar U.S.A/.test(fila));
//       //       let precioDolar = busqueda[res + 2].replace(',', '.').replace(/.*<td>/, '').replace(/<\/td>.*/, '');
//       //       console.log(precioDolar);

//       //       // DolarModel.find({
//       //       //   tipo: `bna`
//       //       // })
//       //       // .then((respuesta) => {
//       //       // console.log(respuesta);
//       //       // })

//       //       pino.info(`actualizando precio del dolar `);
//       //       let agregarDolar = await DolarModel.find({
//       //         tipo: `bna`
//       //       })
//       //       console.log(`agregarDolar: ${agregarDolar}`);

//       //       let dolar = await elementService.postPrecio({tipo: `bna`, dolar: `130`});




//       //     } catch (error) {
//       //       pino.error(`Se produjo un error: ${error}`)
//       //     }



//       //   })




//     }
//     console.log(date.getDay());
//     console.log(date.getHours());

//   } catch (error) {
//     pino.error(`Se produjo un error: ${error}`)
//   }



// }, 1000 * 11); // Donde 1000*60*30 sería cada media hora