import subjectService from "@/services/subject-management/subjectService";
import { Subject } from "@/types/subject";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllSubjectsThunk = createAsyncThunk('subjectManagement/getAllSubjectsThunk', async (_, {rejectWithValue}) => {
    try {
        const response = await subjectService.getAllSubjects();

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const createSubjectThunk = createAsyncThunk('subjectManagement/createSubjectThunk', async (payload: Subject, { rejectWithValue }) => { 
    try {
        const response = await subjectService.createSubject(payload);

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const getSubjectByIdThunk = createAsyncThunk('subjectManagement/getSubjectByIdThunk', async (id: string, { rejectWithValue }) => {
    try {
        const response = await subjectService.getSubjectById(id);

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})