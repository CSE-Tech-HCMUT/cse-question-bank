import { createSlice } from "@reduxjs/toolkit";
import { DepartmentState } from "../../types/department/departmentRedux";

const initialState: DepartmentState = {
  createModalShow: false,
  deleteModalShow: false,
  editModalShow: false,
  viewModalShow: false
};

export const manageDepartmentSlice = createSlice({
  name: 'manageDepartment',
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
  extraReducers: (_builder) => {}

})

export const { reducer: manageDepartmentReducer, actions: manageDepartmentActions } = manageDepartmentSlice;
