import { createSlice } from "@reduxjs/toolkit";
import BankQuestionState from "../../types/bankQuestion/bankQuestion";
import { previewPDFFileThunk } from "./thunk";

const initialState: BankQuestionState = {
  createModalShow: false,
  editModalShow: false,
  deleteModalShow: false,
  questionList: [],
  urlPDF: ""
}

export const manageBankQuestionSlice = createSlice({
  name: 'manageBankQuestion',
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
    }
  },
  extraReducers: (builder) => {
    builder.addCase(previewPDFFileThunk.fulfilled, (state, {payload}) => {
      state.urlPDF = payload;
    })
  }
})

export const { reducer: manageBankQuestionReducer, actions: manageBankQuestionActions } = manageBankQuestionSlice;