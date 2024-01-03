import React, { useEffect, useState } from "react";
import { axiosInstance, fetchFriendRequest } from "../api";
import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SuggestedFriend = () => {
  let {
    user: { token: token },
  } = useSelector((state) => state.user);

  const fetchSuggestedFriend = async ({ token }) => {
    try {
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="p-3 bg-white rounded-lg">
      <div>SUGGESTED FRIEND</div>
    </div>
  );
};

export default SuggestedFriend;
