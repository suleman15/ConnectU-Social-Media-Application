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

  useEffect(() => {
    fetchSugFriend({ token });
  }, []);

  return (
    <div className="bg-secondary border text-foreground p-3 my-3 rounded-lg">
      <div className="font-bold  border-b-foreground border-b mb-5">
        Suggeted Friend Request
      </div>
      {!sugFriend.length > 0 && (
        <div className="text-xs text-center font-light">
          Suggested Friend Request doesn't exist
        </div>
      )}
      {sugFriend?.map((sugfri, index) => {
        return (
          <div key={index}>
            <div className="flex justify-center items-center gap-2  pb-2 bg-background/30 p-3 rounded-lg">
              <Link to={`/profile/${sugfri?._id}`}>
                <img
                  className="w-8 aspect-square rounded-full ring-2 ring-secondary ring-offset-2 ring-offset-background/30"
                  src={
                    sugfri?.profileUrl ??
                    `https://api.dicebear.com/7.x/initials/svg?seed=${`${sugfri?.firstName} ${sugfri?.lastName}`}`
                  }
                  alt="avatar"
                />
              </Link>
              <div className="w-full ">
                <Link to={`/profile/${sugfri?._id}`}>
                  <div className=" font-bold flex text-xs  gap-2   capitalize items-center">
                    <div>
                      {sugfri?.firstName} {sugfri?.lastName}
                    </div>

                    {sugfri?.verified && (
                      <MdVerified className="text-primary  text-md" />
                    )}
                  </div>
                </Link>
                <div className="flex gap-1 justify-end *:rounded-md">
                  <CustomButton
                    title={"add friend"}
                    styles={`text-xs py-[2px]  w-full font-font`}
                    btnAttribute={{
                      onClick: () => {
                        sendFriendRequest({ token, requestTo: sugfri?._id });
                      },
                    }}
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
