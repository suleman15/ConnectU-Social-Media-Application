import React, { useEffect, useState } from "react";
import { axiosInstance } from "../api";
import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SuggestedFriend = ({ userToken }) => {
  let [suggestedFriend, setSuggestedFriend] = useState([]);
  let {
    user: { token: token },
  } = useSelector((state) => state.user);
  const fetchSuggestedFriend = async (token) => {
    try {
      const response = await axiosInstance.post(
        "/users/suggested-friends",
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      setSuggestedFriend(response.data.data);
      console.log(suggestedFriend);
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
      // Handle the error as needed, e.g., show a toast notification
    }
  };
  const sendFriendRequest = async (requestTo, token) => {
    try {
      const response = await axiosInstance
        .post(
          "/users/friend-request",
          {
            requestTo,
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        )
        .then((res) => {
          fetchSuggestedFriend(token);
          return res.data;
        });
      if (response?.success == "failed") toast.error(response.message);
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
      // Handle the error as needed, e.g., show a toast notification
    }
  };

  useEffect(() => {
    fetchSuggestedFriend(userToken);
  }, []);

  return (
    <div className="p-3 bg-white rounded-lg">
      {JSON.stringify(suggestedFriend)}
      <div>SUGGESTED FRIEND</div>
      {suggestedFriend?.map((friend, index) => {
        return (
          <div className="flex justify-between items-center" key={index}>
            <Link to={`/profile/${friend?._id}`}>
              <div className="flex gap-3 items-center text-xs ">
                <img
                  className=" p-1 rounded-full overflow-hidden w-10"
                  src={
                    friend?.profileUrl ??
                    `https://api.dicebear.com/7.x/initials/svg?seed=${`${friend?.firstName} ${friend?.lastName}`}`
                  }
                  alt={friend?.email}
                />
                <div>
                  <div className=" font-bold">
                    {friend?.firstName} {friend?.lastName}
                  </div>
                  <div className="text-[gray]">
                    {friend?.profession ?? "No Profession"}
                  </div>
                </div>
              </div>
            </Link>
            <BsPersonFillAdd
              className="cursor-pointer bg-purple  text-3xl  text-white"
              onClick={() => sendFriendRequest(friend?._id, token)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedFriend;
