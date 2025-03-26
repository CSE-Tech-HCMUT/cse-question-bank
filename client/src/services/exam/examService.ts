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
    getFilterListQuestions: (id: string): Promise<AxiosResponse<{ data: Question[] }>> => apiInstance.get(`/exams/${id}/get-filtered-questions`),

    // latex compile
    compileLatexExam: (id: string) => apiInstance.get<Blob>(`/compile-latex/exams/${id}`, {
        responseType: 'blob'
    })
}

export default examService;