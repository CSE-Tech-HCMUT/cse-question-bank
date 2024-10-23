import { createAsyncThunk } from "@reduxjs/toolkit";
import { TagManagement } from "../../types/tag/tag";
import { tagManagementService } from "../../services/tagManagementService";

export const createTagThunk = createAsyncThunk('manageTag/createTagThunk', async (payload: TagManagement, {rejectWithValue}) => { 
  try {
    const response = await tagManagementService.createTag(payload);
    
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
})

export const getAllTagsThunk = createAsyncThunk('manageTag/getAllTagsThunk', async (_, {rejectWithValue}) => {
  try {
    const response = await tagManagementService.getAllTags();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
})

export const getTagByIdThunk = createAsyncThunk('manageTag/getTagByIdThunk', async (payload: number, {rejectWithValue}) => {
  try {
    const response = await tagManagementService.getTagById(payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
})

export const updateTagByIdThunk = createAsyncThunk('manageTag/updateTagThunk', async (payload: TagManagement, {rejectWithValue}) => {
  try {
    const response = await tagManagementService.updateTagById(payload);
    return {
      data: response.data.data,
      tag: payload 
    };
  } catch (error) {
    return rejectWithValue(error);
  }
})

export const deleteTagByIdThunk = createAsyncThunk('manageTag/deleteTagThunk', async (payload: number, {rejectWithValue}) => {
  try {
    const response = await tagManagementService.deleteTagById(payload);
    return {
      data: response.data.data,
      id: payload
    }
  } catch (error) {
    return rejectWithValue(error);
  }
})