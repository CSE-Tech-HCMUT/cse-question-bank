import { ReduxState } from "@/types/reduxState";
import { TagOption } from "@/types/tagOption";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ReduxState<TagOption> = {
    data: [],
    relatedQuestions: []
}

export const optionManagementSlice = createSlice({
    name: 'optionManagement',
    initialState,
    reducers: {},
    extraReducers: (_builder) => {}
})

export const { reducer: optionManagementReducer, actions: optionManagementActions } = optionManagementSlice;