import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['compileLatex/exportPDFFileThunk/fulfilled'],
        ignoredActionPaths: ['payload'],
        ignoredPaths: ['items.dates']
      }
    }),
})

export type RootState = ReturnType<(typeof store)['getState']>

type AppDispatch = typeof store['dispatch']

export const useAppDispatch: () => AppDispatch = useDispatch