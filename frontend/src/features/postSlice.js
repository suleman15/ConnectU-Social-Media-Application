import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};
export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts(state, action) {
      state.posts = action.payload;
    },
    updateSinglePost(state, action) {
      state.posts.push(action.payload);
    },
  },
});

export default postSlice.reducer;

export const { getPosts, updateSinglePost } = postSlice.actions;
