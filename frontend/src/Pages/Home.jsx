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
  acceptFriendRequest,
  cancelUserReq,
  fetchFriendRequest,
  fetchMainUser,
  fetchSentFriendRequest,
  fetchSuggestedFriend,
  sendFriendReq,
} from "../api";
import { login, updateUser } from "../features/userSlice";

const Home = () => {
  let {
    user,
    user: { token: token },
  } = useSelector((state) => state.user);
  const [userSentRequest, setUserSentRequest] = useState([]);
  const [sugFriend, setSugFriend] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);

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
      console.log("FETCH USER FN RUNs");
      let response = await fetchMainUser({ token });
      console.log(response);
      dispatch(updateUser(response.user));
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
      setUserSentRequest(res?.data);
      fetchSugFriend({ token });
      fetchUserSentRequest({ token });
      return;
    });
  };

  const cancelFriendRequest = async ({ token, rid }) => {
    try {
      const friReq = await fetchFriendRequest({ token, rid });
      console.log(friReq);
      setFriendRequest(friReq?.data);
    } catch (error) {
      console.log("FriendRequest Error FETCHREQUEST");
    }
  };

  const fetchRequest = async ({ token }) => {
    try {
      const friReq = await fetchFriendRequest({ token });
      console.log(friReq);
      setFriendRequest(friReq?.data);
    } catch (error) {
      console.log("FriendRequest Error FETCHREQUEST");
    }
  };

  const acceptRequest = async ({ token, rid, status = "Accepted" }) => {
    console.log("Accept Friend Request");
    try {
      const friReq = await acceptFriendRequest({ token, rid, status }).then(
        async (res) => {
          // const { rufToken, ...data } = res?.data;
          // const data = { token: res.data?.token, ...res.data?.user };
          await fetchUser({ token }).then((response) =>
            fetchRequest({ token })
          );
        }
      );
    } catch (error) {
      console.log("FriendRequest Error ACCEPTREQUEST");
    }
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
              <FriendRequest
                friendRequest={friendRequest}
                setFriendRequest={setFriendRequest}
                fetchRequest={fetchRequest}
                acceptRequest={acceptRequest}
                fetchUser={fetchUser}
              />
              {/* SENT USER FRIEND REQUEST FRINEd */}
              <div className="bg-white p-3 my-3 rounded-lg">
                <div className="font-bold">Sent Friend Request</div>
                {!userSentRequest.length > 0 && (
                  <div className="text-xs">
                    Suggested Friend Request doesn't exist
                  </div>
                )}
                <div>
                  {userSentRequest?.map((item, index) => {
                    return (
                      <div key={index}>
                        <div className="flex gap-3 ">
                          <Link to={`/profile/${item?.requestTo?._id}`}>
                            <img
                              className="p-1 rounded-full overflow-hidden  w-10 h-10"
                              src={
                                item?.requestTo?.profileUrl ??
                                `https://api.dicebear.com/7.x/initials/svg?seed=${`${item?.requestTo?.firstName} ${item?.requestTo?.lastName}`}`
                              }
                              alt="avatar"
                            />
                          </Link>
                          <div className="flex flex-col  ">
                            <Link to={`/profile/${item?.requestTo?._id}`}>
                              <div className=" font-bold flex gap-3 capitalize items-center">
                                {item?.requestTo?.firstName}{" "}
                                {item?.requestTo?.lastName}
                                {item?.requestTo?.verified && (
                                  <MdVerified className="text-[purple] text-xl" />
                                )}
                              </div>
                            </Link>
                            <div className=" ">
                              <CustomButton
                                title={"cancel"}
                                styles={`text-xs rounded-none py-[2px] `}
                                btnAttribute={{
                                  onClick: () =>
                                    cancelRequest({
                                      token,
                                      requestTo: item?.requestTo?._id,
                                    }),
                                }}
                              />
                            </div>
                          </div>
                        </div>
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
