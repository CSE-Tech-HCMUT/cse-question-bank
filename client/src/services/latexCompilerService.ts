import { InputLatex } from "../types/complieLatex/compileLatex";
import apiInstance from "./apiInstance";

export const latexCompilerService = {
  getPDFFile: (payload: InputLatex) => apiInstance.post('/compile-latex', payload)
} 