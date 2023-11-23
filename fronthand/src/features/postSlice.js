import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: {},
};
export const postSlice = createSlice({
  name: "post",
  initialState,
  reducer: {
    getPosts(state, action) {
      state.posts = action.payload;
    },
  },
});

export default postSlice.reducer;

export function setPosts(post) {
  return (dispatch) => dispatch.actions.getPosts(post);
}
