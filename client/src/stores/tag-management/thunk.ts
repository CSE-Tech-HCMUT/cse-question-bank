import tagService from "@/services/tag-management/tagService";
import { TagQuestion } from "@/types/tagQuestion";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllTagsThunk = createAsyncThunk('tagManagement/getAllTagsThunk', async (_, {rejectWithValue}) => { 
    try {
        const response = await tagService.getAllTags();

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const createTagThunk = createAsyncThunk('tagManagement/createTagThunk', async (payload: TagQuestion, { rejectWithValue }) => { 
    try {
        const response = await tagService.createTag(payload);

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const editTagThunk = createAsyncThunk('tagManagement/editTagThunk', async (payload: TagQuestion, { rejectWithValue }) => { 
    try {
        const response = await tagService.editTag(payload);

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const getTagByIdThunk = createAsyncThunk('tagManagement/getTagByIdThunk', async (id: number, { rejectWithValue }) => { 
    try {
        const response = await tagService.getTagById(id);

        return response.data.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const deleteTagThunk = createAsyncThunk('tagManagement/deleteTagThunk', async (id: number, { rejectWithValue }) => {
    try {
        await tagService.deleteTag(id);

        return id;
    } catch (error) {
        return rejectWithValue(error);
    }
})