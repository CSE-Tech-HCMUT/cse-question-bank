import { createSlice } from "@reduxjs/toolkit";
import { TagManagementState } from "../../types/tag/tagRedux";
import { createTagThunk } from "./thunk";
import { toast } from "react-toastify";

const initialState: TagManagementState = {
  createModalShow: false,
  deleteModalShow: false,
  editModalShow: false,
  viewModalShow: false,
  listOfTags: []
};

export const manageTagSlice = createSlice({
  name: 'manageTag',
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
      .addCase(createTagThunk.fulfilled, (state, {payload}) => {
        toast.success("Create Successed!")
      })
      .addCase(createTagThunk.rejected, (_state, _) => {
        toast.error("Create Failed!")
      })
  }

})

export const { reducer: manageTagReducer, actions: manageTagActions } = manageTagSlice;
