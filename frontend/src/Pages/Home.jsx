import { useDispatch, useSelector } from "react-redux";
import TopBar from "../Component/TopBar";
import { FriendCard, FriendRequest, CreatePost, Loading, UserProfile } from "../Component";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SuggestedFriend } from "../Component/SuggestedFriend";

const Home = () => {
  let { user } = useSelector((state) => state.user);
  let [suggestedFriend, setSuggestedFriend] = useState([])
  let userInfo ;
  let dispatch = useDispatch();
  console.log(user?.token);

  const fetchSuggestedFriend = async({token}) => {
    let suggestedFriend = await axios.post("http://localhost:8800/users/suggested-friends", {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}`: ``
      }
    }).then(res => setSuggestedFriend(res.data.data))
  }

    
  useEffect(() => {
    
    fetchSuggestedFriend(user)
  },[])

  return (
    <React.Fragment>
      {JSON.stringify(suggestedFriend)}
        <div className=" flex  bg-bgColor justify-center px-2 ">
          <div className="   lg:w-[1200px] 2xl:w-[1680px]">
            <TopBar />
            {/* Left */}
            <div className="grid grid-col-1 lg:grid-cols-16 gap-5 my-3">
              <div className=" flex gap-10 flex-col  rounded-lg">
                <UserProfile user={user} />
                <FriendCard friends={user?.friends} />
              </div>
              <div >
              <CreatePost user = {user}/>
              </div>
              <div className="bg-white">
                <SuggestedFriend userToken ={user?.token} />
              </div>
            </div>
          </div>
        </div>
     
    </React.Fragment>
  );
};

export default Home;
