import { createSlice } from "@reduxjs/toolkit";
import { OptionState } from "../../../types/option/optionRedux";
import { createOptionThunk } from "./thunk";
import { toast } from "react-toastify";

const initialState: OptionState = {
  createModalShow: false,
  editModalShow: false,
  deleteModalShow: false,
  viewModalShow: false,
  listOfOptions: []
} 

export const manageOptionSlice = createSlice({
  name: 'manageOption',
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
      // create option
      .addCase(createOptionThunk.fulfilled, (state, {payload}) => { 
        state.listOfOptions.push(payload);
        toast.success("Create Option Successed!")
      })
      .addCase(createOptionThunk.rejected, (_state, _) => {
        toast.error("Create Option Failed!")
      })

  }
})

export const { reducer: manageOptionReducer, actions: manageOptionActions } = manageOptionSlice