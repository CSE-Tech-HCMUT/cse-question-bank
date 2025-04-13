import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./thunk";

interface AuthState {
    token: string | null;
    loading: boolean;
    error: string | null;

}
const initialState: AuthState = {
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        state.token = null;
        localStorage.removeItem("access-token");
      },
      clearError: (state) => {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload;
          localStorage.setItem("access-token", action.payload);
        })
        .addCase(loginThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
});

export const { reducer: authReducer, actions: authActions } = authSlice;