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
      localStorage.setItem("post", JSON.stringify(action.payload));
    },
    updateSinglePost(state, action) {
      state.posts.push(action.payload)
      localStorage.setItem("post", JSON.stringify(state.posts));

    }
  },
});

export default postSlice.reducer;

export const { getPosts,  updateSinglePost } = postSlice.actions;
