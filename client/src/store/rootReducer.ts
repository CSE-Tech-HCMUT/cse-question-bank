import { combineReducers } from "@reduxjs/toolkit";
import { compileLatexReducer } from "./latex-compiler/slice";
import { manageBankQuestionReducer } from "./question-bank/slice";

export const rootReducer = combineReducers({
  compileLatexReducer,
  manageBankQuestionReducer
})