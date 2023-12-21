import { useDispatch, useSelector } from "react-redux";
import TopBar from "../Component/TopBar";
import {
  FriendCard,
  FriendRequest,
  CreatePost,
  Loading,
  UserProfile,
  AllPost,
} from "../Component";
import React, { useEffect, useState } from "react";
// import axios from "axios";
import { SuggestedFriend } from "../Component/SuggestedFriend";
import { axiosInstance } from "../api";
import { login, updateUser } from "../features/userSlice";

const Home = () => {
  let { user } = useSelector((state) => state.user);
  let [suggestedFriend, setSuggestedFriend] = useState([]);
  let dispatch = useDispatch();

  const fetchSuggestedFriend = async ({ token }) => {
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
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
      // Handle the error as needed, e.g., show a toast notification
    }
  };
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

      console.log();
      dispatch(updateUser(response.data.user));
      // dispatch(login(response.data.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle the error as needed, e.g., show a toast notification
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    fetchSuggestedFriend(user);
    fetchUser(user);
  }, []);

  return (
    <React.Fragment>
      {JSON.stringify(suggestedFriend)}
      <div className=" flex  bg-bgColor justify-center px-2 ">
        <div className="   lg:w-[1200px] 2xl:w-[1680px]">
          <TopBar />
          {/* Left */}
          <div className="grid grid-col-1 lg:grid-cols-16 gap-5 my-3">
            <div className=" flex gap-10 flex-col  rounded-lg">
              <UserProfile user={user} />
              <FriendCard friends={user?.friends} />
            </div>
            <div>
              <CreatePost user={user} />
              <AllPost />
            </div>
            <div className="bg-white">
              <SuggestedFriend userToken={user?.token} />
              {JSON.stringify(suggestedFriend)}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
