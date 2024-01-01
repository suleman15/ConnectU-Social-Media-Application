import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8800",
  // timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosRequest = async ({ url, token, data, method }) => {
  try {
    const request = await axiosInstance(url, {
      method: method || "GET",
      data: data,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return request.data;
  } catch (error) {
    let err = error.response.data;
    return { status: err.status, message: err.message };
  }
};

export const fetchUser = async ({ token, id }) => {
  try {
    let url = !id ? `users/get-user` : `users/get-user/${id}`;
    let userData = await axiosRequest({
      url,
      token: token,
      method: "POST",
    }).then((res) => res);
    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const fetchAllPost = async (token) => {
  try {
    let fetchData = await axiosRequest({
      url: "/post/",
      method: "post",
      token,
    }).then((res) => res.data);
    console.log(fetchData);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};
export const deleteSinglePost = async ({ token, postId, uId }) => {
  try {
    console.log(token, postId, uId);
    let fetchData = await axiosRequest({
      url: "/post/delete",
      method: "post",
      data: { postId, uId },
      token,
    }).then((res) => res);
    console.log(fetchData);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};
export const likePost = async ({ token, postId }) => {
  console.log("this runs");
  try {
    console.log(postId);
    console.log(token, postId);
    let fetchData = await axiosRequest({
      url: "/post/like",
      method: "post",
      data: { postId },
      token,
    }).then((res) => res);
    // console.log(fetchData);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

export const commentPost = async ({ token, postId, comment }) => {
  try {
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

export const fetchComment = async ({ token, postId }) => {
  try {
    let fetchData = await axiosRequest({
      url: `/post/comments/${postId}`,
      method: "post",
      token,
    }).then((res) => res);
    console.log(fetchData);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};
