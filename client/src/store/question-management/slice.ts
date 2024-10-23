import { createSlice } from "@reduxjs/toolkit";
import { createQuestionThunk, previewPDFFileThunk } from "./thunk";
import { toast } from 'react-toastify';
import { QuestionManagementState } from "../../types/question/questionRedux";

const initialState: QuestionManagementState = {
  editModalShow: false,
  deleteModalShow: false,
  viewModalShow: false,
  listOfQuestion: [],
  urlPDF: ""
}

export const manageQuestionSlice = createSlice({
  name: 'manageQuestion',
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(previewPDFFileThunk.fulfilled, (state, {payload}) => {
        state.urlPDF = payload;
      })
      .addCase(createQuestionThunk.fulfilled, (_state, _) => {
        toast.success("Create Successed!")
      })
      .addCase(createQuestionThunk.rejected, (_state, _) => {
        toast.error("Create Failed!")
      })
  }
})

export const { reducer: manageQuestionReducer, actions: manageQuestionActions } = manageQuestionSlice;