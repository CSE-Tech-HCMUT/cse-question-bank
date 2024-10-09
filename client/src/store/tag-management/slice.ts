import { createSlice } from "@reduxjs/toolkit";
import { MainTagState } from "../../types/tag/tagRedux";

const initialState: MainTagState = {
  createModalShow: false,
  deleteModalShow: false,
  editModalShow: false,
};

export const manageMainTagSlice = createSlice({
  name: 'manageMainTag',
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
  },
  extraReducers: (_builder) => {}

})

export const { reducer: manageMainTagReducer, actions: manageMainTagActions } = manageMainTagSlice;
