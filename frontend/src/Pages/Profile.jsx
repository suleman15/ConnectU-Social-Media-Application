import React, { useEffect, useState } from "react";
import TopBar from "../Component/TopBar";
import UserProfile from "../Component/UserProfile";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMainUser, viewProfile } from "../api";
import { AllPost, CustomButton } from "../Component";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState([]);
  const {
    user: mainuser,
    user: { token: token, _id },
  } = useSelector((state) => state.user);

  const { userId } = useParams();

  const profileView = async ({ token, id }) => {
    console.log(token, id);
    let res = await viewProfile({ token, id });
    getUser({ token, id });
  };

  const getUser = async ({ token, id }) => {
    console.log(token, id);
    let res = await fetchMainUser({ token, id });
    console.log(res);
    setUser(res.user);
  };
  useEffect(() => {
    getUser({ token, id: userId });
    profileView({ token, id: userId });
  }, []);

  return (
    <div className="bg-bgColor w-[99%]">
      <TopBar />
      <div className=" grid  grid-cols-profile gap-3 p-3">
        <div>
          <UserProfile user={user} userEdit={user?._id == _id} />
        </div>
        <div>
          <div>
            <div>
              <Link to={`/profile/${user?._id}`}>
                <div className="flex   flex-col items-center text-sm ">
                  <div
                    className=" w-full  bg-cover bg-white h-[250px] rounded-lg relative mb-[130px]"
                    style={{
                      backgroundImage: `url(${
                        user?.backgroundUrl ?? "https://shorturl.at/rxDV3"
                      })`,
                    }}
                  >
                    <img
                      className="  w-[200px] h-[200px] absolute  bottom-[-45%] right-[calc(50%-100px)] bg-white    rounded-full border-4 border-white"
                      src={
                        user?.profileUrl ??
                        `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
                      }
                      alt="avatar"
                    />
                  </div>

                  <div className="px-[50px] w-full flex justify-between items-center">
                    <div>
                      <div className=" font-bold flex gap-3 capitalize items-center">
                        {user?.firstName} {user?.lastName}
                        {user?.verified && (
                          <MdVerified className="text-[purple] text-xl" />
                        )}
                      </div>
                      <div className="text-[gray] text-xs">
                        {user?.profession ?? "No Profession"}
                      </div>
                    </div>
                    <div>
                      {!mainuser?._id == userId && (
                        <CustomButton title={"Add friend"} />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <AllPost user={mainuser} userId={userId} />
        </div>
        <div></div>
      </div>
    </div>
  );
}
