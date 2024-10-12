import { combineReducers } from "@reduxjs/toolkit";
import { manageBankQuestionReducer } from "./question-bank/slice";
import { manageUserReducer } from "./user-management/slice";
import { manageDepartmentReducer } from "./department-management/slice";
import { manageOptionReducer } from "./tag-management/option/slice";
import { manageTagReducer } from "./tag-management/slice";

export const rootReducer = combineReducers({
  manageBankQuestionReducer,
  manageTagReducer,
  manageUserReducer,
  manageDepartmentReducer,
  manageOptionReducer
})