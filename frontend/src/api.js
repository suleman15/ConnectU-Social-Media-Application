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

export const fetchSuggestedFriend = async ({ token }) => {
  try {
    let userData = await axiosRequest({
      url: "/users/suggested-friends",
      token: token,
      method: "POST",
    }).then((res) => res);
    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const fetchFriendRequest = async ({ token }) => {
  try {
    let userData = await axiosRequest({
      url: "/users/get-friend-request",
      token: token,
      method: "POST",
    }).then((res) => res);
    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const acceptFriendRequest = async ({ token, rid, status }) => {
  try {
    console.log("THis runs");
    let userData = await axiosRequest({
      url: "/users/accept-request",
      token: token,
      data: { rid, status },
      method: "POST",
    }).then((res) => res);
    return userData;
  } catch (error) {
    console.log(error);
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

export const fetchAllPost = async ({ token, search }) => {
  try {
    let fetchData = await axiosRequest({
      url: "/post/",
      method: "post",
      data: { search },
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
export const likePost = async ({ token, postId }) => {
  try {
    console.log(token, postId);
    let fetchData = await axiosRequest({
      url: `/post/like/${postId}`,
      method: "post",
      token,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    // console.log(fetchData);
    // return fetchData;
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

export const fetchSinglePost = async ({ token, postId }) => {
  try {
    let fetchData = await axiosRequest({
      url: `/post/${postId}`,
      method: "post",
      token,
    }).then((res) => res);
    // console.log(fetchData);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

export const fetchSentFriendRequest = async ({ token }) => {
  try {
    let fetchData = await axiosRequest({
      url: `/users/sent-friend-request`,
      method: "post",
      token,
    }).then((res) => res);
    console.log(fetchData);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

export const sendFriendReq = async ({ token, requestTo }) => {
  try {
    let fetchData = await axiosRequest({
      url: `/users/friend-request`,
      method: "post",
      data: { requestTo },
      token,
    }).then((res) => res);
    console.log(fetchData);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

export const cancelUserReq = async ({ token, requestTo }) => {
  try {
    let fetchData = await axiosRequest({
      url: `/users/cancel-user-request`,
      method: "post",
      data: { requestTo },
      token,
    }).then((res) => res);
    console.log(fetchData);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};
