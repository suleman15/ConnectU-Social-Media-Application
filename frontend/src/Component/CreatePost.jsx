import React from "react";
import InputField from "./InputField";
import InputEmoji from "react-input-emoji";
import axios from "axios";
// import { toast } from "react-toast";
const createPost = async (data) => {
  if(data) {
    let fetchData = await axios
    .post("http://localhost:8800/post/create-post", {
      description: data,
    })
    .then((res) => res.data);

    
  console.log(fetchData);
  } 
  // toast.success("Yeay! New data is here.");
}
function CreatePost({ user }) {
  return (
    <div className="p-3 rounded-lg bg-white flex gap-2">
      <img
        className="   w-7"
        src={
          user?.profileUrl ??
          `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
        }
        alt="avatar"
      />
      <InputEmoji className='bg-red'
        cleanOnEnter
        onEnter={createPost}
        placeholder="Type a message"
        borderColor="red"
      />
    </div>
  );
}

export default CreatePost;
