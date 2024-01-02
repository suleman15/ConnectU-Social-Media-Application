import { useEffect, useState } from "react";
import { fetchFriendRequest } from "../api";
import { useSelector } from "react-redux";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";

const FriendRequest = () => {
  const [friendRequest, setFriendRequest] = useState([]);
  const { token } = useSelector((state) => state.user.user);
  const fetchRequest = async ({ token }) => {
    const friReq = await fetchFriendRequest({ token });
    console.log(friReq);
    setFriendRequest(friReq?.data);
  };

  const acceptRequest = async ({ token }) => {};

  useEffect(() => {
    fetchRequest({ token });
  }, []);

  return (
    <div className="bg-white p-3 my-3 rounded-lg">
      <div className="font-bold">Friend Request</div>

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
                      onClick={() => {
                        acceptRequest;
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
