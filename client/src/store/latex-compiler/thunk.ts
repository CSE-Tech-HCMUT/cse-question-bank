import { createAsyncThunk } from "@reduxjs/toolkit";
import { latexCompilerService } from "../../services/latexCompilerService";
import { InputLatex } from "../../types/complieLatex/compileLatex";

export const exportPDFFileThunk = createAsyncThunk('compileLatex/exportPDFFileThunk', async (payload: InputLatex, {rejectWithValue}) => {
  try {
    const data = await latexCompilerService.getPDFFile(payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
})

