import { Option } from "../types/option/option";
import apiInstance from "./apiInstance";

export const optionService = {
  createOption: (payload: Option) => apiInstance.post<Option>('/options', payload)
} 