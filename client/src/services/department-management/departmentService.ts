import { Department } from "@/types/department";
import apiInstance from "../apiInstance";
import { AxiosResponse } from 'axios';

const departmentService = {
    getAllDepartments: (): Promise<AxiosResponse<{ data: Department[] }>> => apiInstance.get('/departments')
}

export default departmentService;