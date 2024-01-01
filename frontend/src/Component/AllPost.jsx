import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../features/postSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

import {
  FaRegShareSquare,
  FaRegTrashAlt,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { commentPost, deleteSinglePost, fetchAllPost, likePost } from "../api";
import InputField from "./InputField";
import { useForm } from "react-hook-form";
import { BiCommentDots } from "react-icons/bi";

function AllPost({ user, userId }) {
  let {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [showIdComment, setShowIdComment] = useState("");
  const {
    user: { _id, token },
  } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const allPost = async ({ token }) => {
    if (!userId) {
      console.log("notuserProfile");
      let res = await fetchAllPost({ token });
      console.log(res);
      dispatch(getPosts(res));
      return;
    }
    console.log("THIS IS RUNNING");
    let res = await fetchAllPost({ token, search: userId });
    dispatch(getPosts(res));
  };
  const mDeleteSinglePost = async ({ token, uId, postId }) => {
    let res = await deleteSinglePost({ token, uId, postId });
    console.log(res);
    allPost({ token });
    toast.success("Post Deleted Successfully");
  };
  const mLikePost = async ({ token, postId }) => {
    let res = await likePost({ token, postId });
    console.log(res);
    allPost({ token });
    toast.success(" Successfully");
  };
  const mCommentPost = async ({ token, postId, comment }) => {
    console.log(token, postId, comment);
    let res = await commentPost({ token, postId, comment });
    console.log(res);
    allPost({ token });
    setValue("comment", "");
    toast.success(" Successfully");
  };

  useEffect(() => {
    allPost({ token });
  }, []);

  return (
    <div className="my-3 flex gap-3 flex-col">
      {posts?.map((post, index) => (
        <div key={index}>
          <div className="bg-white rounded-lg p-3">
            <Link to={"/game"}>
              <div className="p-3 flex  items-center">
                <Link to={`/profile/${post?.userId?._id}`} className="w-full">
                  <div className="flex gap-3 items-center text-sm ">
                    <img
                      className="p-1 rounded-full overflow-hidden w-10 h-10"
                      src={
                        post?.userId?.profileUrl ??
                        `https://api.dicebear.com/7.x/initials/svg?seed=${`${post?.userId?.firstName} ${post?.userId?.lastName}`}`
                      }
                      alt="avatar"
                    />
                    <div>
                      <div className="font-bold capitalize">
                        {post?.userId?.firstName} {post?.userId?.lastName}
                      </div>
                      <div className="text-[gray] text-xs">
                        {moment(post?.createdAt).fromNow()}
                      </div>
                    </div>
                  </div>
                </Link>
                {post?.userId?._id == _id && (
                  <div
                    onClick={() => {
                      mDeleteSinglePost({ token, uId: _id, postId: post?._id });
                    }}
                    className="p-3 cursor-pointer rounded-full bg-[#80808031] hover:bg-[#80808044] "
                  >
                    <FaRegTrashAlt />
                  </div>
                )}
              </div>
              <div className="p-3 ">{post.description}</div>
              <div className="text-sm px-3 font-bold font-mono ">
                {post.like.length}
              </div>
            </Link>
            <div className="p-3 flex justify-around gap-2 text-sm border-t-2 border-[gray]">
              <div
                onClick={() => mLikePost({ token, postId: post?._id })}
                className={`flex gap-3 items-center p-2 rounded-sm cursor-pointer w-full  hover:bg-[#80808044] justify-center ${
                  post.like.includes(user._id) && "text-purple font-bold"
                }`}
              >
                {post.like.includes(user._id) ? (
                  <FaHeart className={"text-lg"} />
                ) : (
                  <FaRegHeart className={"text-lg"} />
                )}
                Like
              </div>
              <div
                onClick={() => setShowIdComment(post?._id)}
                className={`flex gap-3 items-center p-2 rounded-sm cursor-pointer w-full  hover:bg-[#80808044] justify-center `}
              >
                <BiCommentDots className="text-lg" />
                Comment
              </div>

              <div
                className={`flex gap-3 items-center p-2 rounded-sm cursor-pointer w-full  hover:bg-[#80808044] justify-center `}
              >
                <FaRegShareSquare />
                Share
              </div>
            </div>
            {post?._id == showIdComment && (
              <form
                onSubmit={handleSubmit(async ({ comment }) => {
                  mCommentPost({ token, postId: post._id, comment });
                })}
              >
                <InputField
                  styles={`rounded-full text-xs px-5`}
                  register={register("comment", {
                    required: "Comment Can,t be Empty",
                  })}
                  error={errors.comment ? errors.comment.message : ""}
                  placeholder={`comment`}
                />
              </form>
            )}
            {post?.comments?.map(({ userId, comment }, index) => (
              <div key={index} className="my-6 text-xs bg-bgColor">
                <div className="flex gap-3 capitalize font-bold">
                  <Link to={`/profile/${userId?._id}`} className="w-full">
                    <div className="flex gap-3 items-center text-sm ">
                      <img
                        className="p-1 rounded-full overflow-hidden w-10 h-10"
                        src={
                          userId?.profileUrl ??
                          `https://api.dicebear.com/7.x/initials/svg?seed=${`${userId?.firstName} ${userId?.lastName}`}`
                        }
                        alt="avatar"
                      />
                      <div>
                        <div className="font-bold capitalize">
                          {userId?.firstName} {userId?.lastName}
                        </div>
                        <div className="text-[gray] text-xs">
                          {moment(post?.createdAt).fromNow()}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="px-5 py-3 border-b-2 border-[#c7c7c7]">
                  {comment}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllPost;
