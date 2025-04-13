import axios from "axios";

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_PATH,
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
})

apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access-token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default apiInstance;