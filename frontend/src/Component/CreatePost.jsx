import React, { useRef, useState } from "react";
// import InputField from "./InputField";
import axios from "axios";
import { toast } from "react-toastify";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../features/postSlice";
import { fetchAllPost } from "../api";

function CreatePost({ user }) {
  let dispatch = useDispatch();

  let {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ mode: "onChange" });

  let [showEmoji, setShowEmoji] = useState(false);
  let postRef = useRef();

  const createPost = async (token, data) => {
    try {
      if (data?.description) {
        // let fetchData = await axios.post(
        //   "http://localhost:8800/post/create-post",
        //   data, {
        //     headers:
        //   }
        // );
        let fetchData = await axios
          .post("http://localhost:8800/post/create-post", data, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          })
          .then(async (result) => {
            toast.success(result?.data?.message);
            let res = await fetchAllPost(token);
            dispatch(getPosts(res));
            setShowEmoji(!showEmoji);
            return;
          });
        return;
      }
      toast.error("Description in neccessory to add");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  const postSubmited = async (data) => {
    await createPost(user?.token, data);
    setValue("description", "");
  };

  return (
    <div className="p-3 rounded-lg justify-center bg-white flex gap-2 items-center">
      <img
        className="w-10 h-10 "
        src={
          user?.profileUrl ??
          `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
        }
        alt="avatar"
      />
      <form
        className="flex gap-3 items-center justify-center  w-full
      "
        onSubmit={handleSubmit(postSubmited)}
      >
        <InputField
          ref={postRef}
          register={register("description", {
            required: "This field is required",
          })}
          placeholder={`What's you think ~ ${user?.firstName}`}
          error={errors.description ? errors.description.message : ""}
        />
        <div className="relative">
          <div
            className={`p-3 rounded-lg bg-[#8080803d] text-xl ${
              showEmoji && `bg-[#b9b9b9]`
            }`}
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <BsEmojiSmile />
          </div>
          <div className="absolute right-0 top-[120%]">
            {showEmoji && (
              <Picker
                onEmojiClick={(emojiData) => {
                  const description = getValues("description");
                  setValue("description", description + emojiData.emoji);
                }}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
