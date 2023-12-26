import React from "react";
import TopBar from "../Component/TopBar";
import UserProfile from "../Component/UserProfile";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const { userId } = useParams();
  console.log(userId);

  return (
    <div>
      <TopBar />
      <UserProfile user={user} />
      <div></div>
    </div>
  );
}
