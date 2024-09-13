import { createSlice } from "@reduxjs/toolkit";
import BankQuestionState from "../../types/bankQuestion/bankQuestion";
import { previewPDFFileThunk } from "./thunk";

const initialState: BankQuestionState = {
  addModalShow: false,
  urlPDF: ""
}

export const manageBankQuestionSlice = createSlice({
  name: 'manageBankQuestion',
  initialState,
  reducers: {
    setAddModalVisibility(state, { payload }){
      state.addModalShow = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(previewPDFFileThunk.fulfilled, (state, {payload}) => {
      state.urlPDF = payload;
    })
  }
})

export const { reducer: manageBankQuestionReducer, actions: manageBankQuestionActions } = manageBankQuestionSlice;