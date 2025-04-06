import questionService from "@/services/question/questionService";
import { Question, QuestionFilter } from "@/types/question";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllQuestionsThunk = createAsyncThunk('question/getAllQuestionsThunk', async (_, { rejectWithValue }) => {
    try {
        const response = await questionService.getAllQuestions();
        
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const getQuestionByIdThunk = createAsyncThunk('question/getQuestionByIdThunk', async (id: string, { rejectWithValue }) => {
    try {
        const response = await questionService.getQuestionById(id);

        return response.data.data;
    } catch (error) {
        rejectWithValue(error);
    }
})

export const createQuestionThunk = createAsyncThunk('question/createQuestionThunk', async (payload: Question, { rejectWithValue }) => {
    try {
        const response = await questionService.createQuestion(payload);

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const editQuestionThunk = createAsyncThunk('question/editQuestionThunk', async (payload: Question, { rejectWithValue }) => { 
    try {
        await questionService.editQuestion(payload);
        
        return payload.id;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const previewPDFFileThunk = createAsyncThunk('question/previewPDFFileThunk', async (id: string, { rejectWithValue }) => {
    try {
        const response = await questionService.compileLatexQuestion(id);

        return window.URL.createObjectURL(response.data);
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const deleteQuestionThunk = createAsyncThunk('question/deleteQuestionThunk', async (id: string, { rejectWithValue }) => {
    try {
        await questionService.deleteQuestion(id);
        
        return id;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const filterQuestionThunk = createAsyncThunk('question/filterQuestion', async (payload: QuestionFilter, { rejectWithValue }) => {
    try {
        const response = await questionService.filterQuestion(payload);

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})
