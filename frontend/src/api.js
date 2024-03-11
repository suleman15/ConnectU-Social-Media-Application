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
    console.log("USERS/SUGGESTED-FRIENDS");
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
    console.log("USERs/GET-FRIEND-REQUEST");

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
    console.log('"/USERS/ACCEPT-REQUEST"');
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

export const fetchMainUser = async ({ token, id }) => {
  try {
    let url = !id ? `users/get-user` : `users/get-user/${id}`;
    console.log(url);
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

export const fetchSentFriendRequest = async ({ token }) => {
  try {
    console.log(`/USERS/SENT-FRIEND-REQUEST`);
    let fetchData = await axiosRequest({
      url: `/users/sent-friend-request`,
      method: "post",
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

export const sendFriendReq = async ({ token, requestTo }) => {
  try {
    console.log(`/USERS/FRIEND-REQUEST`);
    let fetchData = await axiosRequest({
      url: `/users/friend-request`,
      method: "post",
      data: { requestTo },
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

export const cancelUserReq = async ({ token, requestTo }) => {
  try {
    console.log(`/USERS/CANCEL-USER-REQUEST`);
    let fetchData = await axiosRequest({
      url: `/users/cancel-user-request`,
      method: "post",
      data: { requestTo },
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

export const updateSocialApi = async ({ token, data }) => {
  try {
    console.log(`/USERS/UPDATE-SOCIAL`);
    let fetchData = await axiosRequest({
      url: `/users/update-social`,
      method: "put",
      data,
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};

export const viewProfile = async ({ token, id }) => {
  try {
    console.log(`/USERS/PROFILE-VIEW`);
    let fetchData = await axiosRequest({
      url: `/users/profile-view`,
      method: "post",
      data: { id },
      token,
    }).then((res) => res);
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};
