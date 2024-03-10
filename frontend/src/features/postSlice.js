// postSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  totalPost: 0,
  // other initial state properties
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts: (state, action) => {
      state.posts = action.payload;
    },
    getMorePost: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    replacePost: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      if (index !== -1) {
        // If post exists, replace it
        state.posts[index] = action.payload;
      } else {
        // If post doesn't exist, append it to the state
        state.posts.unshift(action.payload);
      }
    },
    setTotalPost: (state, action) => {
      state.totalPost = action.payload;
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    // other reducers
  },
});

export const { getPosts, getMorePost, replacePost, setTotalPost, deletePost } =
  postSlice.actions;

export default postSlice.reducer;
