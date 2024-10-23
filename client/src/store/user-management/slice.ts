import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "../../types/user/userRedux";

const initialState: UserState = {
  createModalShow: false,
  deleteModalShow: false,
  editModalShow: false,
  viewModalShow: false
};

export const manageUserSlice = createSlice({
  name: 'manageUser',
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

export const { reducer: manageUserReducer, actions: manageUserActions } = manageUserSlice;
