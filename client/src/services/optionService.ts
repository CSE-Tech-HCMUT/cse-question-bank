import { Option } from "../types/option/option";
import apiInstance from "./apiInstance";

export const optionService = {
  createOption: (payload: Option) => apiInstance.post('/options', payload),
  deleteOption: (payload: number) => apiInstance.delete(`/options/${payload}`),
  checkOptionUsed: (payload: number) => apiInstance.post(`/options/${payload}/get-used`)
} 