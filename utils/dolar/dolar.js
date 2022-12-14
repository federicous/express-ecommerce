// import axios from "axios";
const axios = require('axios')
// import Cookies from "universal-cookie";
// import {config} from "../../../config/config";
// const cookies = new Cookies();  
// const token = cookies.get("token");

class ApiQuery {

  async get(url){
      try {
        const configuration = {
          method: "get",
        //   url: `${config.SERVER}${url}`,
          url: `${url}`,
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
	//   withCredentials: true,
        };    
        // make the API call
        let result = await axios(configuration)
        return (result.data);

      } catch (error) {
        console.log(error);
      }
  }

  async post(url, data){
    try {
      const configuration = {
        method: "post",
        url: url,
        data: data,
      };

      let result = await axios(configuration)
      cookies.set("token", result.data.token, {
          path: "/",
        });
        // redirect user to the auth page
        window.location.href = "/";

    } catch (error) {
        console.log(error);
    }
  }


}


// export default ApiQuery;

let apiQuery = new ApiQuery();
// let match;
apiQuery.get(`https://www.bna.com.ar/Personas`)
.then((respuesta)=>{
  console.log(respuesta)
  
  let regexPatternToSearch = new RegExp("Dolar U.S.A.*[\r\n].*[\r\n]", "mg");
    match = respuesta.match(regexPatternToSearch);
    console.log(match);
})