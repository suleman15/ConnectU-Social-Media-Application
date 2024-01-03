import React, { useEffect, useState } from "react";
import {
  SendFriendRequest,
  axiosInstance,
  fetchFriendRequest,
  fetchSuggestedFriend,
} from "../api";
import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CustomButton from "./CustomButton";
import { MdVerified } from "react-icons/md";

const SuggestedFriend = () => {
  const [sugFriend, setSugFriend] = useState([]);
  let {
    user: { token: token },
  } = useSelector((state) => state.user);

  const fetchSugFriend = async ({ token }) => {
    try {
      const suggestedFriend = await fetchSuggestedFriend({ token });
      console.log(suggestedFriend);
      setSugFriend(suggestedFriend?.data);
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
    }
  };
  const sendFriendRequest = async ({ token }) => {
    try {
      const sendFriReq = await SendFriendRequest({ token });
      console.log(sendFriReq);
      // setSugFriend(sendFriReq?.data);
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
    }
  };

  useEffect(() => {
    fetchSugFriend({ token });
  }, []);

  return (
    <div className="p-3 bg-white rounded-lg">
      <div className="font-bold text-sm border-b-2 py-2 border-[#80808056]">
        SUGGESTED FRIEND
      </div>
      {sugFriend?.map((sugfri, index) => {
        return (
          <div key={index}>
            <Link to={`/profile/${sugfri?._id}`}>
              <div className="flex gap-3 items-center text-sm ">
                <img
                  className=" p-1 rounded-full overflow-hidden w-10 h-10"
                  src={
                    sugfri?.profileUrl ??
                    `https://api.dicebear.com/7.x/initials/svg?seed=${`${sugfri?.firstName} ${sugfri?.lastName}`}`
                  }
                  alt="avatar"
                />
                <div>
                  <div className=" font-bold flex gap-3 capitalize items-center">
                    {sugfri?.firstName} {sugfri?.lastName}
                    {sugfri?.verified && (
                      <MdVerified className="text-[purple] text-xl" />
                    )}
                  </div>
                  <div className="text-[gray]">
                    {sugfri?.profession ?? "No Profession"}
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex gap-3 justify-end">
              <CustomButton
                title={"add friend"}
                styles={`text-sm py-[2px]`}
                btnAttribute={{
                  onClick: () => {
                    sendFriendRequest({ token });
                  },
                }}
              />
              <CustomButton title={"Cancel"} styles={`text-sm py-[2px] `} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedFriend;
