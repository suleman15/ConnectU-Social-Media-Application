import { createSlice } from "@reduxjs/toolkit";

// import { user } from "../assets/data";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
  edit: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducer: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
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

export function UserLogin(user) {
  return (dispatch) => {
    dispatch(userSlice.actions.login(user));
    console.log(dispatch.actions);
  };
}
export function userLogout() {
  return (dispatch) => {
    dispatch(userSlice.actions.logout());
  };
}
export function updateProfile(user) {
  return (dispatch) => {
    dispatch(userSlice.actions.updateProfile(user));
  };
}
