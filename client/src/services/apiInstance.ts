import axios from "axios";

export const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PATH,
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

export default apiInstance;