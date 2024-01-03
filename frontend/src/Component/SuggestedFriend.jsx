import React, { useEffect, useState } from "react";
import { axiosInstance, fetchFriendRequest } from "../api";
import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { suggestedFriends } from "../../../server/controllers/userController";

const SuggestedFriend = () => {
  // const [suggestedFriend, setSuggestedFriend] = useState([]);
  // let {
  //   user: { token: token },
  // } = useSelector((state) => state.user);

  // const fetchSuggestedFriend = async ({ token }) => {
  //   try {
  //     const res = await suggestedFriends({ token });
  //     console.log(res);
  //     setSuggestedFriend(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   fetchSuggestedFriend({ token });
  // }, []);

  return (
    <div className="p-3 bg-white rounded-lg">
      <div>Suggested Friend</div>
      {/* {JSON.stringify(suggestedFriend)} */}
    </div>
  );
};

export default SuggestedFriend;
