import { createAsyncThunk } from "@reduxjs/toolkit";
import { Option } from "../../../types/option/option";
import { optionService } from "../../../services/optionService";

export const createOptionThunk = createAsyncThunk('manageOption/createOptionThunk', async (payload: Option, {rejectWithValue}) => { 
  try {
    const respone = await optionService.createOption(payload);
    return respone.data;
  } catch (error) {
    return rejectWithValue(error);
  }
})