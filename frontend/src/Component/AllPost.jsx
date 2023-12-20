import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../features/postSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import { PiThumbsUpLight } from "react-icons/pi";

function AllPost({ user }) {
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const allPost = async () => {
    const res = await axios.post("http://localhost:8800/post/"); // make a request to the api
    console.log(res.data.data);
    dispatch(getPosts(res.data?.data));
  };
  useEffect(() => {
    allPost();
    console.log(posts);
  }, []);

  return (
    <div className="my-3 flex gap-3 flex-col">
      {/* {posts?.map((singlePost, index) => {
        return (
          <div className="bg-white p-3">
            <div></div>
          </div>
        );
      })} */}
      {posts.map((post, index) => (
        <div key={index}>
          <div className="bg-white rounded-lg  p-3">
            <div className="   p-3">
              <Link to={`/profile/${post?.userId?._id}`}>
                <div className="flex gap-3 items-center text-sm ">
                  <img
                    className=" p-1 rounded-full overflow-hidden w-10"
                    src={
                      post?.userId?.profileUrl ??
                      `https://api.dicebear.com/7.x/initials/svg?seed=${`${post?.userId?.firstName} ${post?.userId?.lastName}`}`
                    }
                    alt="avatar"
                  />
                  <div>
                    <div className=" font-bold capitalize">
                      {post?.userId?.firstName} {post?.userId?.lastName}
                    </div>
                    <div className="text-[gray] text-xs">
                      {moment(post?.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="p-3 border-b-2 border-[#33333323]">
              {post.description}
            </div>
            <div>
            <div className="p-3">
            <div className="">{JSON.stringify(post?.like)}</div>
            </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllPost;
