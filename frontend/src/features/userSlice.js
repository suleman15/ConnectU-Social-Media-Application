import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  edit: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { login, logout, updateProfile, updateUser } = userSlice.actions;
