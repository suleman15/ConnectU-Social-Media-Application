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
      state.user.user = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});

export default userSlice.reducer;

export const { login, logout, updateProfile } = userSlice.actions;
