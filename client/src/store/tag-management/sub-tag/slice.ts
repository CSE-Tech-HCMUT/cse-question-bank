import { createSlice } from "@reduxjs/toolkit";
import { SubTagState } from "../../../types/tag/tagRedux";

const initialState: SubTagState = {
  createModalShow: false,
  deleteModalShow: false,
  editModalShow: false,
  viewModalShow: false
};

export const manageSubTagSlice = createSlice({
  name: 'manageSubTag',
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

export const { reducer: manageSubTagReducer, actions: manageSubTagActions } = manageSubTagSlice;
