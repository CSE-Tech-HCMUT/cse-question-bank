import { ReduxState } from "@/types/reduxState";
import { createSlice } from "@reduxjs/toolkit";
import { getAllDepartmentsThunk } from "./thunk";
import { Department } from "@/types/department";

const initialState: ReduxState<Department> = {
    createModalShow: false,
    deleteModalShow: false,
    editModalShow: false,
    viewModalShow: false,
    data: [],
}

export const departmentSlice = createSlice({
    name: 'departmentManagement',
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
            .addCase(getAllDepartmentsThunk.fulfilled, (state, {payload}) => { 
                state.data = payload;
            })
    }
})

export const { reducer: departmentManagementReducer, actions: departmentManagementActions } = departmentSlice