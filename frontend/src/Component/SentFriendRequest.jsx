import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SentFriendRequest = ({}) => {
  const {
    user: { token: token },
  } = useSelector((state) => state.user);
  useEffect(() => {}, []);
  return (
    <div className="p-3 bg-white my-3 rounded-lg">
      <div className="text-sm font-bold py-2 border-b-2 border-[gray]">
        Sent Friend Request
      </div>
    </div>
  );
};

export default SentFriendRequest;
