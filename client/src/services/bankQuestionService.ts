import apiInstance from "./apiInstance";


export const bankQuestionService = {
  // Implement type of output
  getAllBankQuestions: () => apiInstance.get<any>('/question/get-all'),
  getBankQuestionById: (id: number) => apiInstance.get<any>(`/question/get/}${id}`),

  // Implement type of input
  createQuestion: (payload: any) => apiInstance.post('/question/create', payload),
  modifyQuestion: (payload: any) => apiInstance.put('/question/change', payload),
  deleteQuestion: (payload: any) => apiInstance.delete('/question/delete', payload)
}