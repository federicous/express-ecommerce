import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

class Axios {
  constructor(){
     this.port = ""
}
  async get(url, token){
      try {
        const configuration = {
          method: "get",
          url: url,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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


module.exports = new Axios();