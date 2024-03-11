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
import { getPosts, replacePost, setTotalPost } from "../features/postSlice";
import { BiImageAdd } from "react-icons/bi";
import Loading from "./Loading";
import { fetchAllPost } from "../api/postApi";

function CreatePost({ user }) {
  let dispatch = useDispatch();
  const [postSend, setPostSend] = useState(false);
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
    try {
      if (postSend) return;
      if (data?.description) {
        setPostSend(true);
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

        let fetchData = await axios
          .post("http://localhost:8800/post/create-post", formData, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          })
          .then(async (result) => {
            const res = await fetchAllPost({ token, page: 1 }).then((res) => {
              return res.posts;
            });
            dispatch(replacePost(result?.data?.data?.posts));
            dispatch(setTotalPost(result?.data?.data?.totalCount));

            setPostSend(false);

            return;
          });
        return;
      }
      setPostSend(false);

      toast.error("Description in neccessory to add");
    } catch (error) {
      console.error("Error creating post:", error);
      setPostSend(false);

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
    <div className="bg-secondary border rounded-lg p-3 ">
      <div className="rounded-lg justify-center  flex gap-2 items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            className="rounded-full w-10 aspect-square"
            src={
              user?.profileUrl ??
              `https://api.dicebear.com/7.x/initials/svg?seed=${`${user?.firstName} ${user?.lastName}`}`
            }
            alt="avatar"
          />
        </div>
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
            disabled={postSend}
          />

          <InputField
            register={register("image")}
            label={<BiImageAdd />}
            labelStyle={
              " w-10 h-10 text-[24px] bg-background text-primary hover:ring-2 cursor-pointer flex justify-center items-center   rounded-full"
            }
            type={"file"}
            styles={"bg-[red] w-min hidden"}
            parentStyle={" w-min"}
            disabled={postSend}
          />
        </form>

        <div className="relative">
          <div
            className={`p-3 rounded-lg bg-background font-bold text-primary text-xl ${
              showEmoji && `ring-2`
            }`}
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <BsEmojiSmile />
          </div>
          <div className="absolute z-50 right-0 top-[120%]">
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
      {postSend && <Loading />}
      {imagePreview && (
        <div className="w-full max-h-[400px] overflow-hidden rounded-lg my-5">
          <img src={imagePreview} className="w-full" alt={"postImage"} />
        </div>
      )}
    </div>
  );
}

export default CreatePost;
