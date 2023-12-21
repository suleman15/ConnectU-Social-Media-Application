import React from "react";
// import InputField from "./InputField";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import { toast } from "react-toastify";

const createPost = async (data) => {
  try {
    if (data) {
      let fetchData = await axios.post(
        "http://localhost:8800/post/create-post",
        {
          description: data,
        }
      );
      console.log(fetchData.data);
      return;
    }
    toast.error("Description in neccessory to add");
  } catch (error) {
    console.error("Error creating post:", error);
    toast.error("Failed to create post");
  }
};
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
      <InputEmoji
        className="bg-red"
        cleanOnEnter
        onEnter={createPost}
        placeholder="Type a message"
        borderColor="red"
      />
    </div>
  );
}

export default CreatePost;
