import { TagQuestion } from "@/types/tagQuestion";
import apiInstance from "../apiInstance";
import { AxiosResponse } from 'axios';

const tagService = {
    getAllTags: (): Promise<AxiosResponse<{ data: TagQuestion[] }>> => apiInstance.get('/tags'),
    createTag: (payload: TagQuestion): Promise<AxiosResponse<{ data: TagQuestion }>>  => apiInstance.post('/tags', payload),
    getTagById: (id: number): Promise<AxiosResponse<{ data: TagQuestion }>>  => apiInstance.get(`/tags/${id}`),
    editTag: (payload: TagQuestion): Promise<AxiosResponse<{ data: TagQuestion }>> => apiInstance.put(`/tags`, payload),
    deleteTag: (id: number) => apiInstance.delete(`/tags/${id}`)
}

export default tagService;