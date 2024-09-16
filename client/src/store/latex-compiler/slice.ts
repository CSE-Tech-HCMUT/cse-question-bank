import { createSlice } from '@reduxjs/toolkit'
import CompileLatexState from '../../types/complieLatex/compileLatexState'
import { exportPDFFileThunk } from './thunk'

const initialState: CompileLatexState = {
  urlPDF: ''
}

export const compileLatexSlice = createSlice({
  name: 'compileLatex',
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build.addCase(exportPDFFileThunk.fulfilled, (state, { payload }) => {
      state.urlPDF = payload
    })
  }
})

export const { reducer: compileLatexReducer, actions: compileLatexActions } = compileLatexSlice
