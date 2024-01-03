import React, { useEffect, useState } from "react";
import {
  axiosInstance,
  fetchFriendRequest,
  fetchSuggestedFriend,
} from "../api";
import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SuggestedFriend = () => {
  const [sugFriend, setSugFriend] = useState([]);
  let {
    user: { token: token },
  } = useSelector((state) => state.user);

  const fetchSugFriend = async ({ token }) => {
    try {
      const suggestedFriend = await fetchSuggestedFriend({ token });
      console.log(suggestedFriend);
      setSugFriend(suggestedFriend?.data);
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
    }
  };

  useEffect(() => {
    fetchSugFriend({ token });
  }, []);

  return (
    <div className="p-3 bg-white rounded-lg">
      <div>SUGGESTED FRIEND</div>
      {sugFriend?.map((sugfri, index) => {
        return <div key={index}></div>;
      })}
    </div>
  );
};

export default SuggestedFriend;
