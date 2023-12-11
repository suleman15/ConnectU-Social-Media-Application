import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../api";

const FriendRequest = ({ user }) => {
  console.log(user);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  console.log(suggestedFriends);

  return <div>Alphabet</div>;
};

export default FriendRequest;
