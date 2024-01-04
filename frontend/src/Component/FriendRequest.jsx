import { useEffect, useState } from "react";
import { acceptFriendRequest, fetchFriendRequest } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import { login, updateUser } from "../features/userSlice";

const FriendRequest = ({ fetchUser }) => {
  const [friendRequest, setFriendRequest] = useState([]);
  const { token } = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const fetchRequest = async ({ token }) => {
    try {
      const friReq = await fetchFriendRequest({ token });
      console.log(friReq);
      setFriendRequest(friReq?.data);
    } catch (error) {
      console.log("FriendRequest Error");
    }
  };

  const acceptRequest = async ({ token, rid, status = "Accepted" }) => {
    console.log("Accept Friend Request");
    try {
      const friReq = await acceptFriendRequest({ token, rid, status }).then(
        (res) => {
          dispatch(updateUser(fetchUser({ token })));
        }
      );
      console.log(friendRequest);
    } catch (error) {
      console.log("FriendRequest Error");
    }
  };

  useEffect(() => {
    fetchRequest({ token });
  }, []);

  return (
    <div className="bg-white p-3 my-3 rounded-lg">
      <div className="font-bold">Friend Request</div>
      {!friendRequest.length > 0 && (
        <div className="text-xs">Friend Request doesn't exit</div>
      )}

      <div>
        {friendRequest?.map((singleFriend, index) => {
          return (
            <div key={index}>
              <div className="flex gap-3 items-center text-sm ">
                <Link to={`/profile/${singleFriend?.requestFrom?._id}`}>
                  <img
                    className=" p-1 rounded-full overflow-hidden w-10 h-10"
                    src={
                      singleFriend?.requestFrom?.profileUrl ??
                      `https://api.dicebear.com/7.x/initials/svg?seed=${`${singleFriend?.requestFrom?.firstName} ${singleFriend?.requestFrom?.lastName}`}`
                    }
                    alt="avatar"
                  />
                </Link>
                <div>
                  <div className=" font-bold">
                    {singleFriend?.requestFrom?.firstName}{" "}
                    {singleFriend?.requestFrom?.lastName}
                    {singleFriend?.requestFrom?.verified && <MdVerified />}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <CustomButton
                      title={"Confirm"}
                      styles={`py-[5px]   text-xs`}
                      btnAttribute={{
                        onClick: () =>
                          acceptRequest({ token, rid: singleFriend?._id }),
                      }}
                    />
                    <CustomButton
                      title={"Delete"}
                      styles={`py-[5px] bg-[#333] text-xs`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendRequest;
