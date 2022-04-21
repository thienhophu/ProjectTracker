import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  userData: any;
  initialized: boolean;
}

const initialState: AuthState = {
  userData: null,
  initialized: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_INITIALIZED: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    LOGIN: (state, action: PayloadAction<any>) => {
      state.userData = action.payload.user;
    },
    LOGOUT: (state) => {
      state.userData = null;
    },
    REGISTER: (state, action: PayloadAction<any>) => {
      state.userData = action.payload.user;
    },
    SET_USER_DATA: (state, action: PayloadAction<any>) => {
      state.userData = { ...state.userData, ...action.payload.userData };
    },
  },
});

// Action creators are generated for each case reducer function
export const { SET_INITIALIZED, LOGIN, LOGOUT, REGISTER, SET_USER_DATA } = authSlice.actions;

export default authSlice.reducer;
