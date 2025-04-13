import { AxiosResponse } from "axios";
import apiInstance from "../apiInstance";
import { LoginType } from "@/types/auth";

const authService = {
    login: (payload: LoginType): Promise<AxiosResponse<{ data: string }>> => apiInstance.post('/authen/login', payload)
}

export default authService