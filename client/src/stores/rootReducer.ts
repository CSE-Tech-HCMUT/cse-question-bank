import { combineReducers } from "@reduxjs/toolkit";
import { tagManagementReducer } from "./tag-management/slice";
import { optionManagementReducer } from "./option-management/slice";
import { departmentManagementReducer } from "./department-management/slice";
import { subjectManagementReducer } from "./subject-management/slice";
import { questionReducer } from "./question/slice";
import { examReducer } from "./exam/slice";
import { authReducer } from "./auth/slice";

const rootReducer = combineReducers({
    tagManagementReducer,
    optionManagementReducer,
    departmentManagementReducer,
    subjectManagementReducer,
    questionReducer,
    examReducer,
    authReducer
})

export default rootReducer;