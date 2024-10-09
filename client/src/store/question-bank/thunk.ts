import { createAsyncThunk } from "@reduxjs/toolkit";
import { InputBlockQuestion, InputSimpleQuestion } from "../../types/question/inputQuestion";
import { bankQuestionService } from "../../services/bankQuestionService";
import { Question, QuestionInput } from "../../types/bankQuestion/bankQuestion";

export const previewPDFFileThunk = createAsyncThunk('manageBankQuestion/previewPDFFileThunk', async (payload: InputBlockQuestion | InputSimpleQuestion | any, {rejectWithValue}) => {
  try {
    const data = await bankQuestionService.previewPDFQuestion(payload);
    return window.URL.createObjectURL(data.data);
  } catch (error) {
    return rejectWithValue(error);
  }
})

export const createQuestionThunk = createAsyncThunk('manageBankQuestion/createQuestionThunk', async (payload: QuestionInput, {rejectWithValue}) => {
  try {
    const data = await bankQuestionService.createQuestion(payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
})
