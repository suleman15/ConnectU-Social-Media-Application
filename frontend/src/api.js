import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:8800",
  responseType: "json", // or 'arraybuffer', 'blob', 'document', 'text', etc.
});

export const apiRequest = async (url, token, data, method) => {
  try {
    const request = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return request.data;
  } catch (error) {
    let err = error.response.data;
    return { status: err.status, message: err.message };
  }
};

export const fetchUser = async (token, id) => {
  try {
    let url = !id ? `user/get-user` : `user/get-user/${id}`;
    let userData = apiRequest({
      url,
      token: token,
      method: "POST",
    });
  } catch (error) {
    console.log(error);
  }
};
