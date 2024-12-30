import axios from "axios";

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_PATH,
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
})

export default apiInstance;