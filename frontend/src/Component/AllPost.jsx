import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../features/postSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";

import {
  FaRegThumbsUp,
  FaCommentAlt,
  FaRegShareSquare,
  FaTrashAlt,
  FaRegTrashAlt,
} from "react-icons/fa";
import { deleteSinglePost, fetchAllPost, likePost } from "../api";
import { Emoji } from "emoji-picker-react";

function AllPost({ user }) {
  const {
    user: { _id, token },
  } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const allPost = async (token) => {
    let res = await fetchAllPost(token);
    console.log(res);
    dispatch(getPosts(res));
  };
  const mDeleteSinglePost = async ({ token, uId, postId }) => {
    let res = await deleteSinglePost({ token, uId, postId });
    console.log(res);
    allPost(token);
    toast.success("Post Deleted Successfully");
  };
  const mLikePost = async ({ token, postId }) => {
    let res = await likePost({ token, postId });
    console.log(res);
    // allPost(token);
    // toast.success("Post Deleted Successfully");
  };

  useEffect(() => {
    allPost(token);
  }, []);

  return (
    <div className="my-3 flex gap-3 flex-col">
      {posts?.map((post, index) => (
        <div key={index}>
          <div className="bg-white rounded-lg p-3">
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
            <div className="p-3 flex justify-around gap-2">
              <div
                onClick={() => mLikePost({ token, postId: post?._id })}
                className="flex gap-3 items-center p-3 rounded-sm cursor-pointer w-full bg-[#80808031] hover:bg-[#80808044] justify-center"
              >
                <div className="rounded-full text-white flex justify-center items-center text-xs bg-[black] w-5 h-5 ">
                  {post.like.length}
                </div>
                <Emoji unified="1f423" size="25" />
                <FaRegThumbsUp />
                Like
              </div>
              <div className="flex gap-3 items-center p-3 rounded-sm cursor-pointer w-full bg-[#80808031] hover:bg-[#80808044] justify-center">
                <FaCommentAlt />
                Comment
              </div>
              <div className="flex gap-3 items-center p-3 rounded-sm cursor-pointer w-full bg-[#80808031] hover:bg-[#80808044] justify-center">
                <FaRegShareSquare />
                Share
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllPost;
