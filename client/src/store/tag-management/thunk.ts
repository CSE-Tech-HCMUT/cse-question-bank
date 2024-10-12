import { createAsyncThunk } from "@reduxjs/toolkit";
import { TagManagement } from "../../types/tag/tag";
import { tagManagementService } from "../../services/tagManagementService";

export const createTagThunk = createAsyncThunk('manageTag/createTagThunk', async (payload: TagManagement, {rejectWithValue}) => { 
  try {
    const response = await tagManagementService.createTag(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
})