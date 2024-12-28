import optionService from "@/services/option-management/optionService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteOptionThunk = createAsyncThunk(
    'optionManagement/deleteOption',
    async (id: number, { rejectWithValue }) => {
        try {
            const checkResponse = await optionService.checkOptionIsUsed(id);
            if(checkResponse.data.data){
                return rejectWithValue({ message: 'Option is currently in use.' });
            }

            const response = await optionService.deleteOption(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)