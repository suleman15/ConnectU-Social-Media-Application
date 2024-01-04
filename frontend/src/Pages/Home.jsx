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
  CustomButton,
} from "../Component";
import React, { useEffect, useState } from "react";
// import axios from "axios";
import { axiosInstance, fetchSentFriendRequest } from "../api";
import UserSentRequest from "../Component/SentFriendRequest";
import { login, updateUser } from "../features/userSlice";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";

const Home = () => {
  let {
    user,
    user: { token: token },
  } = useSelector((state) => state.user);
  const [userSentRequest, setUserSentRequest] = useState([]);
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

  const fetchUserSentRequest = async ({ token }) => {
    const res = await fetchSentFriendRequest({ token });
    setUserSentRequest(res?.data);
  };

  useEffect(() => {
    fetchUser(user);
    fetchUserSentRequest({ token });
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
              {/* SENT USER FRIEND REQUEST FRINEd */}
              <div className="p-3 bg-white my-3 rounded-lg">
                <div className="text-sm font-bold py-2 border-b-2 border-[gray]">
                  Sent Friend Request
                </div>
                <div>
                  {JSON.stringify(userSentRequest)}
                  {userSentRequest?.map((item, index) => {
                    return (
                      <div key={index}>
                        <Link to={`/profile/${item?.requestTo?._id}`}>
                          <div className="flex gap-3 items-center text-sm ">
                            <img
                              className=" p-1 rounded-full overflow-hidden w-10 h-10"
                              src={
                                item?.requestTo?.profileUrl ??
                                `https://api.dicebear.com/7.x/initials/svg?seed=${`${item?.requestTo?.firstName} ${item?.requestTo?.lastName}`}`
                              }
                              alt="avatar"
                            />
                            <div>
                              <div className=" font-bold flex gap-3 capitalize items-center">
                                {item?.requestTo?.firstName}{" "}
                                {item?.requestTo?.lastName}
                                {item?.requestTo?.verified && (
                                  <MdVerified className="text-[purple] text-xl" />
                                )}
                              </div>
                              <div className="text-[gray]">
                                {item?.requestTo?.profession ?? "No Profession"}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
              <SuggestedFriend />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
