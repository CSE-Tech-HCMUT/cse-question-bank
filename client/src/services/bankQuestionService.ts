import { QuestionInput } from "../types/bankQuestion/bankQuestion";
import { InputBlockQuestion, InputSimpleQuestion } from "../types/question/inputQuestion";
import apiInstance from "./apiInstance";


export const bankQuestionService = {
  previewPDFQuestion: (payload: InputBlockQuestion | InputSimpleQuestion | any) => apiInstance.post<Blob>('/latex-compile', payload, {
    responseType: 'blob'
  }),

  // Implement type of output
  getAllBankQuestions: () => apiInstance.get<any>('/question/get-all'),
  getBankQuestionById: (id: number) => apiInstance.get<any>(`/question/get/}${id}`),

  // Implement type of input
  createQuestion: (payload: QuestionInput) => apiInstance.post('/questions', payload),
  modifyQuestion: (payload: any) => apiInstance.put('/question/change', payload),
  deleteQuestion: (payload: any) => apiInstance.delete('/question/delete', payload)
}