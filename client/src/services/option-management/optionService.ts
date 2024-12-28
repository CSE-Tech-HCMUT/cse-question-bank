import { TagOption } from "@/types/tagOption";
import apiInstance from "../apiInstance";
import { AxiosResponse } from 'axios';

const optionService = {
    createOption: (payload: TagOption): Promise<AxiosResponse<{ data: TagOption }>> => apiInstance.post('/options', payload),
    deleteOption: (id: number) => apiInstance.post(`/options/${id}`),
    checkOptionIsUsed: (id: number): Promise<AxiosResponse<{ data: boolean }>> => apiInstance.post(`/options/${id}/get-used`)
}

export default optionService;