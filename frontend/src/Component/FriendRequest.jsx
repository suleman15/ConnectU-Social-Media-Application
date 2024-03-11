import { useEffect, useState } from "react";
import { acceptFriendRequest, fetchFriendRequest } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import { login, updateUser } from "../features/userSlice";

const FriendRequest = ({
  fetchUser,
  data: {
    friendRequest,
    setFriendRequest,
    fetchRequest,
    acceptRequest,
    cancelFriendRequest,
  },
}) => {
  const { token } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchRequest({ token });
  }, []);

  return (
    <div className="bg-secondary border text-foreground p-3 my-3 rounded-lg">
      <div className="font-bold  border-b-foreground border-b mb-5">
        Friend Request
      </div>
      {!friendRequest.length > 0 && (
        <div className="text-xs text-center font-light">
          Friend Request doesn't exist
        </div>
      )}

      <div>
        {friendRequest?.map((singleFriend, index) => {
          return (
            <div key={index}>
              <div className="flex justify-center items-center gap-2  pb-2 bg-background/30 p-3 rounded-lg">
                <Link to={`/profile/${singleFriend?.requestFrom?._id}`}>
                  <img
                    className="w-8 aspect-square rounded-full ring-2 ring-secondary ring-offset-2 ring-offset-background/30"
                    src={
                      singleFriend?.requestFrom?.profileUrl ??
                      `https://api.dicebear.com/7.x/initials/svg?seed=${`${singleFriend?.requestFrom?.firstName} ${singleFriend?.requestFrom?.lastName}`}`
                    }
                    alt="avatar"
                  />
                </Link>
                <div className="w-full ">
                  <Link to={`/profile/${singleFriend?._id}`}>
                    <div className=" font-bold flex text-xs  gap-2   capitalize items-center">
                      <div>
                        {singleFriend?.requestFrom?.firstName}{" "}
                        {singleFriend?.requestFrom?.lastName}
                      </div>

                      {singleFriend?.requestFrom?.verified && (
                        <MdVerified className="text-primary  text-md" />
                      )}
                    </div>
                  </Link>
                  <div className="flex gap-1 justify-end *:rounded-md">
                    <CustomButton
                      title={"Confirm"}
                      styles={`text-xs py-[2px]  w-full font-font`}
                      btnAttribute={{
                        onClick: () =>
                          acceptRequest({ token, rid: singleFriend?._id }),
                      }}
                    />
                    <CustomButton
                      title={"Delete"}
                      styles={`text-xs py-[2px]  w-full font-font`}
                      btnAttribute={{
                        onClick: () =>
                          cancelFriendRequest({
                            token,
                            rid: singleFriend?._id,
                          }),
                      }}
                    />
                  </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <div className=" font-bold flex gap-3 capitalize items-center">
                    {singleFriend?.requestFrom?.firstName}{" "}
                    {singleFriend?.requestFrom?.lastName}
                    {singleFriend?.requestFrom?.verified && (
                      <MdVerified className="text-[purple] text-xl" />
                    )}
                  </div>

                  <div className="flex gap-3 justify-end">
                 
                  </div> */}
                {/* </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendRequest;
