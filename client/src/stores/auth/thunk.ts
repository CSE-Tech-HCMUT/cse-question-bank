import authService from "@/services/auth/authService";
import { LoginType } from "@/types/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const loginThunk = createAsyncThunk("auth/loginThunk", async (payload: LoginType, { rejectWithValue }) => {
    try {
        const response = await authService.login(payload);
        toast.success("Đăng nhập thành công!");
        return response.data.data;
    } catch (error) {
        let errorMessage = "Đăng nhập thất bại!";
      
        if (error instanceof AxiosError) {
            errorMessage = error.response?.data?.message || error.message;
        }
      
        toast.error(errorMessage);
        return rejectWithValue(error);
    }
})