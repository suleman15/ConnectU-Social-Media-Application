import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import { fetchSuggestedFriend, sendFriendReq } from "../api";
import CustomButton from "./CustomButton";

const SuggestedFriend = ({ fetchSugFriend, sendFriendRequest, sugFriend }) => {
  // const [sugFriend, setSugFriend] = useState([]);
  let {
    user: { token: token },
  } = useSelector((state) => state.user);
  console.log(sugFriend);

  useEffect(() => {
    fetchSugFriend({ token });
  }, []);

  return (
    <div className="bg-white p-3 my-3 rounded-lg">
      <div className="font-bold">Suggeted Friend Request</div>
      {!sugFriend.length > 0 && (
        <div className="text-xs">Suggested Friend Request doesn't exist</div>
      )}
      {sugFriend?.map((sugfri, index) => {
        return (
          <div key={index}>
            <div className="flex gap-3 items-center text-sm ">
              <Link to={`/profile/${sugfri?._id}`}>
                <img
                  className=" p-1 rounded-full overflow-hidden w-10 h-10"
                  src={
                    sugfri?.profileUrl ??
                    `https://api.dicebear.com/7.x/initials/svg?seed=${`${sugfri?.firstName} ${sugfri?.lastName}`}`
                  }
                  alt="avatar"
                />
              </Link>
              <div className="flex flex-col gap-3">
                <Link
                  to={`/profile/${sugfri?._id}`}
                  className=" font-bold flex gap-3 capitalize items-center"
                >
                  {sugfri?.firstName} {sugfri?.lastName}
                  {sugfri?.verified && (
                    <MdVerified className="text-[purple] text-xl" />
                  )}
                </Link>
                <div className="flex gap-1 justify-end">
                  <CustomButton
                    title={"add friend"}
                    styles={`text-xs rounded-none py-[2px]`}
                    btnAttribute={{
                      onClick: () => {
                        sendFriendRequest({ token, requestTo: sugfri?._id });
                      },
                    }}
                  />
                  <CustomButton
                    title={"Cancel"}
                    styles={`text-xs rounded-none py-[2px] `}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedFriend;
