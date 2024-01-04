import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AllPost,
  CreatePost,
  CustomButton,
  FriendCard,
  FriendRequest,
  SuggestedFriend,
  UserProfile,
} from "../Component";
import TopBar from "../Component/TopBar";
// import axios from "axios";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  axiosInstance,
  cancelUserReq,
  fetchSentFriendRequest,
  fetchSuggestedFriend,
  sendFriendReq,
} from "../api";
import { updateUser } from "../features/userSlice";

const Home = () => {
  let {
    user,
    user: { token: token },
  } = useSelector((state) => state.user);
  const [userSentRequest, setUserSentRequest] = useState([]);
  const [sugFriend, setSugFriend] = useState([]);

  let dispatch = useDispatch();

  const fetchSugFriend = async ({ token }) => {
    try {
      const suggestedFriend = await fetchSuggestedFriend({ token });
      setSugFriend(suggestedFriend?.data);
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
    }
  };
  const sendFriendRequest = async ({ token, requestTo }) => {
    try {
      const res = await sendFriendReq({ token, requestTo }).then((res) => {
        console.log(res);
        toast.error(res.message);
        fetchSugFriend({ token });
        fetchUserSentRequest({ token });
        return;
      });
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
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
  const cancelRequest = async ({ token, requestTo }) => {
    const res = await cancelUserReq({ token, requestTo }).then((res) => {
      console.log(res);

      setUserSentRequest(res?.data);
      fetchSugFriend({ token });
      fetchUserSentRequest({ token });
      return;
    });
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
                        <CustomButton
                          title={"cancel"}
                          styles={`text-sm py-[2px]`}
                          btnAttribute={{
                            onClick: () =>
                              cancelRequest({
                                token,
                                requestTo: item?.requestTo?._id,
                              }),
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <SuggestedFriend
                sugFriend={sugFriend}
                setSugFriend={setSugFriend}
                sendFriendRequest={sendFriendRequest}
                fetchSugFriend={fetchSugFriend}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
