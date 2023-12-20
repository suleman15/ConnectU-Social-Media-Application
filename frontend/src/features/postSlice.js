import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};
export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
      localStorage.setItem("post", JSON.stringify(action.payload));
    },
  },
});

export default postSlice.reducer;

export const { setPosts } = postSlice.actions;
