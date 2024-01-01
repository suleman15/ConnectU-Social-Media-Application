import React, { useEffect, useState } from "react";
import TopBar from "../Component/TopBar";
import UserProfile from "../Component/UserProfile";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUser } from "../api";
import { AllPost } from "../Component";

export default function Profile() {
  const [user, setUser] = useState([]);
  const {
    user: { token: token },
  } = useSelector((state) => state.user);

  const { userId } = useParams();

  const getUser = async ({ token, id }) => {
    console.log(token, id);
    let res = await fetchUser({ token, id });
    console.log(res);
    setUser(res.user);
  };
  useEffect(() => {
    getUser({ token, id: userId });
  }, []);

  return (
    <div>
      <TopBar />
      <div>
        <div>
          <UserProfile user={user} userEdit={false} />
        </div>
        <div>
          <AllPost user={user} userId={userId} />
        </div>
        <div></div>
      </div>
    </div>
  );
}
