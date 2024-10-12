import { createSlice } from "@reduxjs/toolkit";
import { OptionState } from "../../../types/option/optionRedux";
import { createOptionThunk } from "./thunk";
import { toast } from "react-toastify";

const initialState: OptionState = {
  data: []
} 

export const manageOptionSlice = createSlice({
  name: 'manageOption',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOptionThunk.fulfilled, (state, {payload}) => { 
        state.data = [ ...state.data, payload ];
        toast.success("Create Option Successed!", {
          delay: 1000         
        })
      })
      .addCase(createOptionThunk.rejected, (_state, _) => {
        toast.error("Create Option Failed!", {
          delay: 1000         
        })
      })
  }
})

export const { reducer: manageOptionReducer, actions: manageOptionActions } = manageOptionSlice