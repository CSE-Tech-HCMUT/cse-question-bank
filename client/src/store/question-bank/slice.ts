import { createSlice } from "@reduxjs/toolkit";
import BankQuestionState from "../../types/bankQuestion/bankQuestion";
import { createQuestionThunk, previewPDFFileThunk } from "./thunk";
import { toast } from 'react-toastify';

const initialState: BankQuestionState = {
  editModalShow: false,
  deleteModalShow: false,
  viewModalShow: false,
  questionList: [],
  urlPDF: ""
}

export const manageBankQuestionSlice = createSlice({
  name: 'manageBankQuestion',
  initialState,
  reducers: {
    setEditModalVisibility(state, action: { payload: boolean }){
      state.editModalShow = action.payload;
    },
    setDeleteModalVisibility(state, action: { payload: boolean }){
      state.deleteModalShow = action.payload;
    },
    setViewModalVisibility(state, action: { payload: boolean }){
      state.viewModalShow = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(previewPDFFileThunk.fulfilled, (state, {payload}) => {
        state.urlPDF = payload;
      })
      .addCase(createQuestionThunk.fulfilled, (_state, _) => {
        toast.success("Create Successed!", {
          delay: 1000         
        })
      })
      .addCase(createQuestionThunk.rejected, (_state, _) => {
        toast.error("Create Failed!", {
          delay: 1000         
        })
      })
  }
})

export const { reducer: manageBankQuestionReducer, actions: manageBankQuestionActions } = manageBankQuestionSlice;