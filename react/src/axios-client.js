import axios from "axios";
import {useStateContext} from "./context/ContextProvider";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    // const token = "123";
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const {response} = error;
    if(response.status === 401){
        localStorage.removeItem("ACCESS_TOKEN");
        //window.location.reload();
    }else if(response.status === 404){
        //TODO show not found
    }

    throw error;
});

export default axiosClient;