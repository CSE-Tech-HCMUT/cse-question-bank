import { Question } from "@/types/question";
import apiInstance from "../apiInstance";
import { AxiosResponse } from 'axios';

const questionService = {
    // question
    getAllQuestions: (): Promise<AxiosResponse<{ data: Question[] }>> => apiInstance.get('/questions'),
    createQuestion: (payload: Question): Promise<AxiosResponse<{ data: Question }>> => apiInstance.post('/questions', payload),
    getQuestionById: (id: string): Promise<AxiosResponse<{ data: Question }>> => apiInstance.get(`/questions/${id}`),
    editQuestion: (payload: Question): Promise<AxiosResponse<{ data: Question }>> => apiInstance.put(`/questions`, payload),
    deleteQuestion: (id: string) => apiInstance.delete(`/questions/${id}`),

    // latex compile
    compileLatexQuestion: (id: string) => apiInstance.get<Blob>(`/compile-latex/questions/${id}`, {
        responseType: 'blob'
    })
}

export default questionService;