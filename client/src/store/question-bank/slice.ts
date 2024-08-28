import { createSlice } from "@reduxjs/toolkit";
import BankQuestionState from "../../types/bankQuestion/bankQuestion";

const initialState: BankQuestionState = {
  addModalShow: false
}

export const manageBankQuestionSlice = createSlice({
  name: 'manageBankQuestion',
  initialState,
  reducers: {
    setAddModalVisibility(state, { payload }){
      state.addModalShow = payload;
    }
  }
})

export const { reducer: manageBankQuestionReducer, actions: manageBankQuestionActions } = manageBankQuestionSlice;