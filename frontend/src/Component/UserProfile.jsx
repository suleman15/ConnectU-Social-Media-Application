import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import {
  BiBriefcase,
  BiEdit,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoTwitter,
} from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";
import { userEdited } from "../features/userSlice";
const UserProfile = ({ user }) => {
  const { user: data, edit } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div className="bg-white p-3 rounded-lg">
      <div className="flex justify-between  items-center border-b-2 py-2  border-[lightgray]">
        <Link to={`/profile/${user?._id}`}>
          <div className="flex gap-3 items-center text-sm ">
            <img
              className=" p-1 rounded-full overflow-hidden w-10 h-10"
              src={
                user?.profileUrl ??
                `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
              }
              alt="avatar"
            />
            <div>
              <div className=" font-bold">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[gray]">
                {user?.profession ?? "No Profession"}
              </div>
            </div>
          </div>
        </Link>
        <BiEdit
          className="cursor-pointer"
          onClick={() => dispatch(userEdited())}
        />
      </div>
      <div>
        <div className="border-b-2 border-[lightgray] ">
          <div className="flex gap-2 items-center my-2  text-sm">
            <CiLocationOn />
            {user?.location ?? "Add Location"}
          </div>
          <div className="flex gap-2 items-center my-2  text-sm">
            <BiBriefcase />
            {user?.profession ?? "Add Profession"}
          </div>
        </div>
        <div className="flex flex-col gap-2 py-3 border-b-2 border-[lightgray]">
          <div className="flex gap-2 items-center  font-semibold">
            <div className="flex gap-3">
              <div>{user?.friends?.length}</div>
              Friends
            </div>
          </div>
          <div className="flex justify-between text-sm items-center ">
            Who views your profile{" "}
            <div className="font-bold">{user?.views?.length} </div>
          </div>
          <div className="text-xs text-[blue] ">
            {user?.verified ? "Verified Account" : "Not Verified"}
          </div>
          <div className="flex justify-between text-xs items-center ">
            <div className="font-semibold">Joined:</div>{" "}
            {moment(user?.createdAt).fromNow()}
          </div>
        </div>
        <div className="flex flex-col text-xs py-3 gap-2">
          <div className="text-base font-bold">Social Profile</div>
          <div className="flex flex-col gap-1 text-blue ">
            <div className="flex gap-3  ">
              <BiLogoFacebook className="text-lg  " /> Facebook
            </div>
            <div className="flex gap-3  ">
              <BiLogoInstagram className="text-lg " /> Instagram
            </div>
            <div className="flex gap-3  ">
              <BiLogoTwitter className="text-lg " /> Twitter
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
