import axios from "axios";

export const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PATH,
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

// apiInstance.get('/longRequest', {
//   timeout: 10000
// })

export default apiInstance;