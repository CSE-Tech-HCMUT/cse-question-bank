import { combineReducers } from "@reduxjs/toolkit";
import { manageBankQuestionReducer } from "./question-bank/slice";
import { manageMainTagReducer } from "./tag-management/slice";
import { manageSubTagReducer } from "./tag-management/sub-tag/slice";
import { manageUserReducer } from "./user-management/slice";
import { manageDepartmentReducer } from "./department-management/slice";
import { manageOptionReducer } from "./tag-management/option/slice";

export const rootReducer = combineReducers({
  manageBankQuestionReducer,
  manageMainTagReducer,
  manageSubTagReducer,
  manageUserReducer,
  manageDepartmentReducer,
  manageOptionReducer
})