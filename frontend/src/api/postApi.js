import { axiosRequest } from "./axiosMain";

// LIKE POST API
export const likePost = async ({ token, postId }) => {
  try {
    console.log(`/POST/LIKE/${postId}`);
    let fetchData = await axiosRequest({
      url: `/post/like/${postId}`,
      method: "post",
      token,
    }).catch((err) => console.log(err));
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

//COMMENT POST API
export const commentPost = async ({ token, postId, comment }) => {
  try {
    console.log(`/POST/COMMENT/${postId}`);

    let fetchData = await axiosRequest({
      url: `/post/comment/${postId}`,
      method: "post",
      data: { comment },
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

//FETCH ALL COMMENT API
export const fetchComment = async ({ token, postId }) => {
  try {
    console.log(`/POST/COMMENTS/${postId}`);

    let fetchData = await axiosRequest({
      url: `/post/comments/${postId}`,
      method: "post",
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

//FETCH SINGLE POST API
export const fetchSinglePost = async ({ token, postId }) => {
  try {
    console.log(`/POST/${postId}`);
    let fetchData = await axiosRequest({
      url: `/post/${postId}`,
      method: "post",
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

//DELETE SINGLE POST
export const deleteSinglePost = async ({ token, postId, uId }) => {
  try {
    console.log(`/POST/DELETE/${postId}`);
    let fetchData = await axiosRequest({
      url: `/post/delete/${postId}`,
      method: "post",
      data: { postId, uId },
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

//FETCH ALL POST
export const fetchAllPost = async ({ token, search, page }) => {
  try {
    console.log("/POST/");
    let fetchData = await axiosRequest({
      url: "/post/",
      method: "post",
      data: { search, page },
      token,
    }).then((res) => res.data);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};
