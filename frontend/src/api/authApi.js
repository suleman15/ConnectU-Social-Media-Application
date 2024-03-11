import { axiosRequest } from "./axiosMain";

export const loginUser = async ({ data }) => {
  try {
    console.log(data);
    const fetchData = await axiosRequest({
      url: "auth/login",
      data: data,
      method: "POST",
    }).catch((err) => console.log(err));
    return fetchData;
  } catch (err) {
    console.log(err);
  }
};
