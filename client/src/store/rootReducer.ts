import { combineReducers } from "@reduxjs/toolkit";
import { manageBankQuestionReducer } from "./question-bank/slice";

export const rootReducer = combineReducers({
  manageBankQuestionReducer
})