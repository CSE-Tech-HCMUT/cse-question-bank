import { Subject } from "@/types/subject";
import apiInstance from "../apiInstance";
import { AxiosResponse } from 'axios';

const subjectService = {
    getAllSubjects: (): Promise<AxiosResponse<{ data: Subject[] }>> => apiInstance.get('/subjects'),
    createSubject: (payload: Subject): Promise<AxiosResponse<{ data: Subject }>> => apiInstance.post('/subjects', payload),
    getSubjectById: (id: string): Promise<AxiosResponse<{ data: Subject }>> => apiInstance.get(`/subjects/${id}`),
}

export default subjectService;