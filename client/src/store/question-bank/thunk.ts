import { createAsyncThunk } from "@reduxjs/toolkit";
import { InputBlockQuestion, InputSimpleQuestion } from "../../types/question/inputQuestion";
import { bankQuestionService } from "../../services/bankQuestionService";

export const previewPDFFileThunk = createAsyncThunk('manageBankQuestion/previewPDFFileThunk', async (payload: InputBlockQuestion | InputSimpleQuestion | any, {rejectWithValue}) => {
  try {
    const data = await bankQuestionService.previewPDFQuestion(payload);
    return window.URL.createObjectURL(data.data);
  } catch (error) {
    return rejectWithValue(error);
  }
})
