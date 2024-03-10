import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMorePost, getPosts, replacePost } from "../features/postSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { IoChatboxOutline } from "react-icons/io5";

import {
  FaRegShareSquare,
  FaRegTrashAlt,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import {
  commentPost,
  deleteSinglePost,
  fetchAllPost,
  fetchSinglePost,
  likePost,
} from "../api";
import InputField from "./InputField";
import { useForm } from "react-hook-form";
import { BiCommentDots } from "react-icons/bi";
import Animation from "./Animation";
import CustomButton from "./CustomButton";

const SeeMoreText = ({ text, maxLength }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const displayText = showFullText ? text : text.slice(0, maxLength);

  return (
    <div className="inline text-center " style={{ wordWrap: "break-word" }}>
      <span className="text-sm text-[gray]">{displayText}</span>
      {text.length > maxLength && (
        <button
          onClick={toggleText}
          className="text-[10px] border-b-2  border-[gray] mx-3"
        >
          {showFullText ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
};

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
  let page = 1;
  const dispatch = useDispatch();

  const allPost = async ({ token, page }) => {
    console.log("aall ppost");
    if (!userId) {
      let res = await fetchAllPost({ token, page });
      console.log(res);
      if (page == 1) {
        dispatch(getPosts(res));
      } else {
        dispatch(getMorePost(res));
      }
      return;
    }
    let res = await fetchAllPost({ token, search: userId, page });
    dispatch(getPosts(res));
  };
  const mDeleteSinglePost = async ({ token, uId, postId }) => {
    let res = await deleteSinglePost({ token, uId, postId });
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
    let res = await commentPost({ token, postId, comment }).then(
      async (res) => {
        await fetchSinglePost({
          token,
          postId,
        });
        dispatch(replacePost(res));
        setValue("comment", "");
        toast.success(" Successfully");
      }
    );
  };

  useEffect(() => {
    allPost({ token, page });
  }, []);

  return (
    <div className="my-3 flex gap-3 flex-col">
      {JSON.stringify(posts.length)}
      {!posts.length > 0 && (
        <div className="flex justify-center items-center text-3xl h-96">
          Doesn't exist any post
        </div>
      )}

      {posts?.map((post, index) => {
        const [showComment, setShowComment] = useState(false);
        return (
          <Animation key={index} index={index}>
            <div className={"bg-white rounded-lg p-3"}>
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
              <div>
                <div className="p-3 whitespace-break-spaces">
                  <SeeMoreText text={post.description} maxLength={30} />

                  {/* {post.description} */}
                </div>
                {post?.image && (
                  <div className="w-full max-h-[400px] overflow-hidden p-4 mb-10 rounded-3xl">
                    <img
                      src={post?.image}
                      className="w-full"
                      alt={"postImage"}
                    />
                  </div>
                )}
              </div>
              <Link to={`/post/${post?._id}`}>
                <div className="text-sm flex justify-between  pb-2">
                  <div className="flex items-center gap-3">
                    {post.like.length > 0 && <FaHeart />}
                    {post.like.length}
                  </div>
                  <div className="flex items-center gap-3">
                    <IoChatboxOutline /> {post?.comments?.length}
                  </div>
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
              {/* COMMENT FORM  */}
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
              {post?.comments?.length > 0 && (
                <button
                  onClick={async () => {
                    const res = await fetchSinglePost({
                      token,
                      postId: post._id,
                    });
                    dispatch(replacePost(res));

                    setShowComment(!showComment);
                  }}
                >
                  {!showComment ? `Show Comments` : `Hide Comments`}
                </button>
              )}
              {/* {JSON.stringify(post?.comments)} */}
            </div>
          </Animation>
        );
      })}
      <button
        onClick={async () => {
          page += 1;
          await allPost({ token, page }); // Fetch posts for the new page
        }}
      >
        Load More
      </button>
    </div>
  );
}

export default AllPost;
