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
  const [page, setPage] = useState(1);

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
      let response = await fetchMainUser({ token });
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
      setFriendRequest(friReq?.data);
    } catch (error) {
      console.log("FriendRequest Error FETCHREQUEST");
    }
  };

  const acceptRequest = async ({ token, rid, status = "Accepted" }) => {
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
                data={{
                  friendRequest,
                  setFriendRequest,
                  fetchRequest,
                  acceptRequest,
                }}
                fetchUser={fetchUser}
              />

              <div className="bg-secondary border text-foreground p-3 my-3 rounded-lg">
                <div className="font-bold  border-b-foreground border-b mb-5">
                  Sent Friend Request
                </div>
                {!userSentRequest.length > 0 && (
                  <div className="text-xs text-center font-light">
                    Suggested Friend Request doesn't exist
                  </div>
                )}
                <div className="flex flex-col gap-2 ">
                  {userSentRequest?.map((item, index) => {
                    return (
                      <div key={index}>
                        <div className="flex justify-center items-center gap-2  pb-2 bg-background/30 p-3 rounded-lg">
                          <Link to={`/profile/${item?.requestTo?._id}`}>
                            <img
                              className="w-8 aspect-square rounded-full ring-2 ring-secondary ring-offset-2 ring-offset-background/30"
                              src={
                                item?.requestTo?.profileUrl ??
                                `https://api.dicebear.com/7.x/initials/svg?seed=${`${item?.requestTo?.firstName} ${item?.requestTo?.lastName}`}`
                              }
                              alt="avatar"
                            />
                          </Link>
                          <div className="w-full leading-3">
                            <Link to={`/profile/${item?.requestTo?._id}`}>
                              <div className=" font-bold flex text-xs  gap-2   capitalize items-center">
                                <div>
                                  {item?.requestTo?.firstName}{" "}
                                  {item?.requestTo?.lastName}
                                </div>
                                {item?.requestTo?.verified && (
                                  <MdVerified className="text-primary text-xl" />
                                )}
                              </div>
                            </Link>
                            <div className=" w-full">
                              <CustomButton
                                title={"cancel"}
                                styles={`text-xs py-[2px]  w-full font-font`}
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
