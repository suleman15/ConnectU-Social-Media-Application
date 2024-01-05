import React, { useRef, useState } from "react";
// import InputField from "./InputField";
import axios from "axios";
import { toast } from "react-toastify";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../features/postSlice";
import { fetchAllPost } from "../api";
import { BiImageAdd } from "react-icons/bi";

function CreatePost({ user }) {
  let dispatch = useDispatch();

  let {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    control,

    setValue,
  } = useForm({ mode: "onChange" });

  const selectedImage = useWatch({
    control,
    name: "image", // replace with your file input name
  });

  const imagePreview = selectedImage
    ? URL.createObjectURL(selectedImage[0])
    : null;

  let [showEmoji, setShowEmoji] = useState(false);
  let postRef = useRef();

  const createPost = async ({ token, data }) => {
    console.log(token, data);
    try {
      if (data?.description) {
        // let fetchData = await axios.post(
        //   "http://localhost:8800/post/create-post",
        //   data, {
        //     headers:
        //   }
        // );
        const formData = new FormData();
        Object.keys(data).map((key) => {
          key != "image"
            ? formData.set(key, getValues(key))
            : formData.set(key, getValues(key)[0]);
          console.log(formData.get(key));
        });

        // console.log(formData.get("backgroundUrl"));
        // console.log(formData.get("profileUrl"));
        let fetchData = await axios
          .post("http://localhost:8800/post/create-post", formData, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          })
          .then(async (result) => {
            console.log("res");
            toast.success(result?.data?.message);
            let res = await fetchAllPost({ token });
            dispatch(getPosts(res));
            setShowEmoji(false);
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
    setShowEmoji(false);
    await createPost({ token: user?.token, data });
    setValue("description", "");
    setValue("image", "");
  };

  return (
    <div className="bg-white rounded-lg p-3 ">
      <div className="rounded-lg justify-center  flex gap-2 items-center">
        <img className="w-10 h-10 " src={user?.profileUrl} alt="avatar" />
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
            styles={`w-full`}
          />

          <InputField
            register={register("image")}
            label={<BiImageAdd />}
            labelStyle={
              " w-10 h-10 text-[1.5rem] cursor-pointer flex justify-center items-center text-[1.6rem]  rounded-full"
            }
            type={"file"}
            styles={"bg-[red] w-min hidden"}
            parentStyle={" w-min"}
          />
        </form>

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
      </div>
      {imagePreview && (
        <div className="w-full max-h-[400px] overflow-hidden rounded-lg my-5">
          <img src={imagePreview} className="w-full" alt={"postImage"} />
        </div>
      )}
    </div>
  );
}

export default CreatePost;
