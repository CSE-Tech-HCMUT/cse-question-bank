import { createSlice } from '@reduxjs/toolkit'
import CompileLatexState from '../../types/complieLatex/compileLatexState'
import { exportPDFFileThunk } from './thunk'

const initialState: CompileLatexState = {}

export const compileLatexSlice = createSlice({
  name: 'compileLatex',
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build.addCase(exportPDFFileThunk.fulfilled, (state, { payload }) => {
      console.log('PDF File Check', payload, state)
    })
  }
})

export const { reducer: compileLatexReducer, actions: compileLatexActions } = compileLatexSlice
