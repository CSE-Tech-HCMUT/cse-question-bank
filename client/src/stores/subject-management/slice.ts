import { ReduxState } from "@/types/reduxState";
import { createSlice } from "@reduxjs/toolkit";
import { getAllSubjectsThunk, getSubjectByIdThunk } from "./thunk";
import { Subject } from "@/types/subject";

const initialState: ReduxState<Subject> = {
    createModalShow: false,
    deleteModalShow: false,
    editModalShow: false,
    viewModalShow: false,
    data: [],
    dataById: undefined,
}

export const subjectSlice = createSlice({
    name: 'subjectManagement',
    initialState,
    reducers: {
        setCreateModalVisibility(state, action: { payload: boolean }){      
            state.createModalShow = action.payload;
          },
        setEditModalVisibility(state, action: { payload: boolean }){
            state.editModalShow = action.payload;
        },
        setDeleteModalVisibility(state, action: { payload: boolean }){
            state.deleteModalShow = action.payload;
        },
        setViewModalVisibility(state, action: { payload: boolean }){
            state.viewModalShow = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllSubjectsThunk.fulfilled, (state, {payload}) => {
                state.data = payload;
            })

            .addCase(getSubjectByIdThunk.fulfilled, (state, {payload}) => {
                state.dataById = payload;
            })
    }
})

export const { reducer: subjectManagementReducer, actions: subjectManagementActions } = subjectSlice