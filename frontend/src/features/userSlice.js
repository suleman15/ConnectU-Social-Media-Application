import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  edit: false,
  editSocial: false,
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
    userEdited(state, action) {
      state.edit = !state.edit;
    },
    updateUser(state, action) {
      state.user = {
        ...state.user,
        ...Object.entries(action.payload)
          .filter(([key]) => key !== "token")
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
      };

      // state.user = { ...state.user, ...action.payload };
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
    updateSocial(state, action) {
      state.editSocial = !state.editSocial;
    },
  },
});

export default userSlice.reducer;

export const {
  login,
  logout,
  updateProfile,
  updateUser,
  userEdited,
  updateSocial,
} = userSlice.actions;
