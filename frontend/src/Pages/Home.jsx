import { useDispatch, useSelector } from "react-redux";
import TopBar from "../Component/TopBar";
import {
  FriendCard,
  FriendRequest,
  CreatePost,
  Loading,
  UserProfile,
  AllPost,
  SuggestedFriend,
} from "../Component";
import React, { useEffect, useState } from "react";
// import axios from "axios";
import { axiosInstance } from "../api";
import { login, updateUser } from "../features/userSlice";

const Home = () => {
  let { user } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  const fetchUser = async ({ token }) => {
    try {
      const response = await axiosInstance.post(
        "/users/get-user",
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      dispatch(updateUser(response.data.user));
      // dispatch(login(response.data.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle the error as needed, e.g., show a toast notification
    }
  };

  useEffect(() => {
    fetchUser(user);
  }, []);

  return (
    <React.Fragment>
      <div className=" flex    bg-bgColor justify-center px-2 ">
        <div className="w-full">
          <TopBar />
          {/* Left */}
          <div className=" grid grid-col-1 lg:grid-cols-16 gap-5 my-3">
            <div className=" flex gap-10 flex-col  rounded-lg">
              <UserProfile user={user} userEdit={true} />
              <FriendCard friends={user?.friends} />
            </div>
            <div>
              <CreatePost user={user} />
              <AllPost user={user} />
            </div>
            <div>
              <FriendRequest />
              <SuggestedFriend />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
