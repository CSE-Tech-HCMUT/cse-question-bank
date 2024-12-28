import departmentService from "@/services/department-management/departmentService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllDepartmentsThunk = createAsyncThunk('departmentManagement/getAllDepartmentsThunk', async (_, { rejectWithValue }) => {
    try {
        const response = await departmentService.getAllDepartments();

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})