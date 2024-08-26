import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.API_PATH,
  method: "get",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
})

apiInstance.interceptors.response.use(
  (response) => { 
    return response;
  }
)

apiInstance.get('/longRequest', {
  timeout: 10000
})