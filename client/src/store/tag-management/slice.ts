import { createSlice } from "@reduxjs/toolkit";
import { TagManagementState } from "../../types/tag/tagRedux";
import { createTagThunk, deleteTagByIdThunk, getAllTagsThunk, updateTagByIdThunk } from "./thunk";
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
      // fetch all tag
      .addCase(getAllTagsThunk.fulfilled, (state, {payload}) => {
        state.listOfTags = payload;
      })

      // create tag
      .addCase(createTagThunk.fulfilled, (state, {payload}) => {
        state.listOfTags.push(payload);
        toast.success("Create Successed!")
      })
      .addCase(createTagThunk.rejected, (_state, _) => {
        toast.error("Create Failed!")
      })

      .addCase(updateTagByIdThunk.fulfilled, (state, {payload}) => {
        state.listOfTags = state.listOfTags.map(tag => tag.id === payload.tag.id? payload.tag : tag);
        toast.success("Updated Successed!")
      })
      .addCase(updateTagByIdThunk.rejected, (_state, _) => {
        toast.error("Update Failed!")
      })

      // delete tag
      .addCase(deleteTagByIdThunk.fulfilled, (state, {payload}) => {
        toast.success("Deleted Successed!")
        state.listOfTags = state.listOfTags.filter(tag => tag.id!== payload.id);
      })
      .addCase(deleteTagByIdThunk.rejected, (_state, _) => {
        toast.error("Delete Failed!")
      })
  }

})

export const { reducer: manageTagReducer, actions: manageTagActions } = manageTagSlice;
