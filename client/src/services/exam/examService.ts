import { Exam } from "@/types/exam";
import apiInstance from "../apiInstance";
import { AxiosResponse } from 'axios';
import { Question } from "@/types/question";

const examService = {
    // exam
    getAllExams: (): Promise<AxiosResponse<{ data: Exam[] }>> => apiInstance.get('/exams'),
    createExam: (payload: Exam): Promise<AxiosResponse<{ data: Question }>> => apiInstance.post('/exams', payload),
    getExamById: (id: string): Promise<AxiosResponse<{ data: Exam }>> => apiInstance.get(`/exams/${id}`),
    editExam: (payload: Exam): Promise<AxiosResponse<{ data: Exam }>> => apiInstance.put(`/exams`, payload),
    deleteExam: (id: string) => apiInstance.delete(`/exams/${id}`),
    generateAutoExam: (id: string): Promise<AxiosResponse<{ data: Exam }>> => apiInstance.post(`/exams/${id}/generate-auto`),
    getFilterListExams: (id: string): Promise<AxiosResponse<{ data: Exam }>> => apiInstance.get(`/exams/${id}/get-filter-list`),

    // latex compile
    compileLatexExam: (id: string) => apiInstance.get<Blob>(`/compile-latex/exams/${id}`, {
        responseType: 'blob'
    })
}

export default examService;