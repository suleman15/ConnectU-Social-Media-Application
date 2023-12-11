import { useDispatch, useSelector } from "react-redux";
import TopBar from "../Component/TopBar";
import { FriendCard, FriendRequest, Loading, UserProfile } from "../Component";
import React, { useEffect, useState } from "react";
import { apiRequest, fetchUser } from "../api";
import { login } from "../features/userSlice";

const Home = () => {
  let { user } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let [loading, setLoading] = useState(false);
  let [suggestedFriends, setSuggestedFriends] = useState([]);
  let [usr, setUser] = useState([]);
  console.log(user?.token);
  let getUser = async () => {
    const res = await fetchUser(user?.token);
    const data = { token: user?.token, ...res };
    dispatch(login(data));
  };
  let getSuggestedFriend = async () => {
    try {
      const res = await apiRequest({
        url: "/users/suggested-friends",
        token: user?.token,
        method: "POST",
      });
      console.log(res?.data);
      setSuggestedFriends(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // getUser();
    getSuggestedFriend();
    getUser();
    // console.log(usr);
  }, []);

  return (
    <React.Fragment>
      {!loading ? (
        <div className=" flex  bg-bgColor justify-center px-2 ">
          <div className="   lg:w-[1200px] 2xl:w-[1680px]">
            <TopBar />
            {/* Left */}
            <div className="grid grid-col-1 lg:grid-cols-16 gap-5 my-3">
              <div className=" flex gap-10 flex-col  rounded-lg">
                <UserProfile user={user} />
                <FriendCard friends={user?.friends} />
              </div>
              <div className="bg-white"></div>
              <div className="bg-white"></div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

export default Home;
