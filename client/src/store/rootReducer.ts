import { combineReducers } from "@reduxjs/toolkit";
import { manageUserReducer } from "./user-management/slice";
import { manageDepartmentReducer } from "./department-management/slice";
import { manageOptionReducer } from "./tag-management/option/slice";
import { manageTagReducer } from "./tag-management/slice";
import { manageQuestionReducer } from "./question-management/slice";

export const rootReducer = combineReducers({
  manageQuestionReducer,
  manageTagReducer,
  manageUserReducer,
  manageDepartmentReducer,
  manageOptionReducer
})