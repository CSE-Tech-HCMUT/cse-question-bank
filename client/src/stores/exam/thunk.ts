import examService from "@/services/exam/examService";
import { Exam } from "@/types/exam";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createExamThunk = createAsyncThunk('exam/createExamThunk', async (payload: Exam, { rejectWithValue }) => { 
    try {
        const response = await examService.createExam(payload);

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const previewPDFFileThunk = createAsyncThunk('exam/previewPDFFileThunk', async (id: string, { rejectWithValue }) => {
    try {
        const response = await examService.compileLatexExam(id);

        return window.URL.createObjectURL(response.data);
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const editExamThunk = createAsyncThunk('exam/editExamThunk', async (payload: Exam, { rejectWithValue }) => { 
    try {
        const response = await examService.editExam(payload);

        return response.data.data;
    } catch (error) {
        rejectWithValue(error);
    }
})

export const generateAutoExamThunk = createAsyncThunk('exam/generateAutoExamThunk', async (id: string, {rejectWithValue}) => {
    try {
        const response = await examService.generateAutoExam(id);

        return response.data.data;
    } catch (error) {
        rejectWithValue(error);
    }
})