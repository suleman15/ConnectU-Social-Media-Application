import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPosts,
  getMorePost,
  replacePost,
  setTotalPost,
  deletePost,
} from "../features/postSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { IoChatboxOutline } from "react-icons/io5";
import { FaRegShareSquare } from "react-icons/fa";

import InputField from "./InputField";
import { useForm } from "react-hook-form";
import {
  BiChat,
  BiCommentDots,
  BiHeart,
  BiSolidHeart,
  BiSolidSend,
  BiSolidTrashAlt,
} from "react-icons/bi";
import CustomButton from "./CustomButton";
import Loading from "./Loading";
import {
  commentPost,
  deleteSinglePost,
  fetchAllPost,
  fetchSinglePost,
  likePost,
} from "../api/postApi";

const SeeMoreText = ({ text, maxLength }) => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const displayText = showFullText ? text : text.slice(0, maxLength);

  return (
    <div
      className=" text-foreground bg-background/30  p-3 rounded-lg "
      style={{ wordWrap: "break-word" }}
    >
      <span className="text-sm ">{displayText}</span>
      {text.length > maxLength && (
        <button
          onClick={toggleText}
          className="text-[10px]  mx-3 inline-block  border-b border-primary relative before:content-[''] before:absolute before:h-0 before:w-full reflect  before:-z-10 hover:before:h-1/2 before:transition-[height] before:duration-800 before:bottom-0 before:left-0  px-2   before:bg-primary  leading-tight"
        >
          {showFullText ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
};

function AllPost({ user, userId }) {
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState({});
  const [loading, setLoading] = useState({
    sentComment: false,
  });

  const [page, setPage] = useState(1);
  const [showIdComment, setShowIdComment] = useState("");
  const {
    user: { _id, token },
  } = useSelector((state) => state.user);
  const { posts, totalPost } = useSelector((state) => state.post);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const toggleComments = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const allPost = async ({ token, page }) => {
    try {
      console.log("Fetching posts");
      let res;
      if (!userId) {
        res = await fetchAllPost({ token, page }).then((response) => {
          dispatch(setTotalPost(response.totalCount));
          if (page === 1) {
            dispatch(getPosts(response.posts));
          } else {
            dispatch(getMorePost(response.posts));
          }
        });
      } else {
        res = await fetchAllPost({ token, search: userId, page }).then(
          (response) => {
            dispatch(setTotalPost(response.totalCount));
            if (page === 1) {
              dispatch(getPosts(response.posts));
            } else {
              dispatch(getMorePost(response.posts));
            }
          }
        );
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    allPost({ token, page });
  }, [page]);
  // useEffect(() => {
  //   allPost({ token, page });
  // }, [token, page, userId]);

  const mDeleteSinglePost = async ({ token, uId, postId }) => {
    try {
      const res = await deleteSinglePost({ token, uId, postId });
      dispatch(deletePost(postId)); // Dispatch the deletePost action
      dispatch(setTotalPost(totalPost - 1));
      toast.success("Post Deleted Successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const mLikePost = async ({ token, postId }) => {
    try {
      const res = await likePost({ token, postId }).then(async (res) => {
        const data = await fetchSinglePost({ token, postId });
        dispatch(replacePost(data));
      });

      toast.success("Post Liked Successfully");
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const mCommentPost = async ({ token, postId, comment }) => {
    try {
      const res = await commentPost({ token, postId, comment }).then(
        async () => {
          const data = await fetchSinglePost({ token, postId });
          dispatch(replacePost(data));
        }
      );
      setValue("comment", "");
      toast.success("Commented Successfully");
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };
  return (
    <div className="my-3 flex gap-3 flex-col ">
      {!posts.length > 0 && (
        <div className="flex justify-center items-center text-3xl h-96">
          No posts available.
        </div>
      )}

      {posts.map((post, index) => {
        return (
          <div
            key={index}
            className="bg-secondary/80 backdrop-blur-lg  rounded-lg border p-3 text-foreground"
          >
            {/* HEADER POST */}
            <div className="p-3 flex items-center">
              <Link to={`/profile/${post?.userId?._id}`} className="w-full">
                <div className="flex gap-3 items-center text-sm">
                  <img
                    className="w-8 aspect-square rounded-full ring-2 ring-secondary ring-offset-2 ring-offset-background/30"
                    src={
                      post?.userId?.profileUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${post?.userId?.firstName} ${post?.userId?.lastName}`
                    }
                    alt="avatar"
                  />
                  <div>
                    <div className="font-bold capitalize">
                      {post?.userId?.firstName} {post?.userId?.lastName}
                    </div>
                    <div className="text-foreground/50 text-xs">
                      {moment(post?.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              </Link>
              {post?.userId?._id === _id && (
                <div
                  onClick={() =>
                    mDeleteSinglePost({
                      token,
                      uId: _id,
                      postId: post?._id,
                    })
                  }
                  className="p-3 cursor-pointer rounded-full bg-primary/10 text-primary/80 hover:text-primary hover:bg-primary/30"
                >
                  <BiSolidTrashAlt />
                </div>
              )}
            </div>
            {/* CONTENT POST */}
            <div>
              <div className="p-3 whitespace-break-spaces">
                {/* {post.description} */}
                <SeeMoreText text={post.description} maxLength={30} />
              </div>
              {/* Post Image */}
              {post?.image && (
                <div className="w-full max-h-[400px] overflow-hidden p-4 mb-10 rounded-3xl">
                  <img src={post?.image} className="w-full" alt={"postImage"} />
                </div>
              )}
            </div>
            {/* CONTENT LIKE OR COMMENT TOTAL */}
            <Link to={`/post/${post?._id}`}>
              <div className="text-sm flex justify-between  pb-2">
                <div className="flex justify-center gap-1 px-2  rounded-full items-center  bg-background text-primary ring-2">
                  {post.like.length > 0 && <BiSolidHeart />}
                  {post.like.length}
                </div>
                <div className="flex justify-center gap-1 px-2  rounded-full items-center  bg-background text-primary ring-2">
                  <BiChat /> {post?.comments?.length}
                </div>
              </div>
            </Link>
            {/* FOOTER OR COMMENT SECTION */}
            <div className="p-3 flex justify-around gap-2 text-sm ">
              <div
                onClick={() => mLikePost({ token, postId: post?._id })}
                className={`flex gap-3 items-center p-2 rounded-sm cursor-pointer w-full  ring-foreground/5 ring-[2px] hover:bg-primary/10 justify-center ${
                  post.like.includes(user._id) && "text-primary font-bold"
                }`}
              >
                {post.like.includes(user._id) ? (
                  <BiSolidHeart className={"text-lg"} />
                ) : (
                  <BiHeart className={"text-lg"} />
                )}
                Like
              </div>
              <div
                onClick={() => setShowIdComment(post?._id)}
                className={`flex gap-3 items-center p-2 rounded-sm cursor-pointer w-full  ring-foreground/5 ring-[2px] hover:bg-primary/10 justify-center `}
              >
                <BiCommentDots className="text-lg" />
                Comment
              </div>

              <div
                className={`flex gap-3 items-center p-2 rounded-sm cursor-pointer w-full  ring-foreground/5 ring-[2px] hover:bg-primary/10 justify-center `}
              >
                <FaRegShareSquare />
                Share
              </div>
            </div>
            {/* COMMENT FORM INPUT FIELD  */}
            {post?._id == showIdComment && (
              <div>
                <form
                  onSubmit={handleSubmit(async ({ comment }) => {
                    setLoading({ ...loading, sentComment: true });
                    await mCommentPost({ token, postId: post._id, comment });
                    setLoading({
                      ...loading,
                      sentComment: false,
                    });
                  })}
                  className="flex gap-2  items-center justify-center"
                >
                  <img
                    className="w-8 aspect-square rounded-full ring-2 ring-secondary ring-offset-2 ring-offset-background/30"
                    src={
                      post?.userId?.profileUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${post?.userId?.firstName} ${post?.userId?.lastName}`
                    }
                    alt="avatar"
                  />
                  <InputField
                    styles={` text-xs px-4 py-2`}
                    register={register("comment", {
                      required: "Comment Can,t be Empty",
                    })}
                    error={errors.comment ? errors.comment.message : ""}
                    placeholder={`comment`}
                    disabled={loading.sentComment} // Disable input field when loading.sentComment is true
                  />
                  <CustomButton
                    type={`submit`}
                    title={<BiSolidSend className="text-secondary" />}
                    btnAttribute={{
                      disabled: loading.sentComment,
                    }}
                  />
                </form>
                {loading.sentComment && <Loading />}
              </div>
            )}
            {/* SINGLE POST COMMENT  */}
            {showComments[post._id] && post?.comments?.length > 0 && (
              <div className="flex flex-col gap-2  mt-5 text-xs ">
                {post?.comments?.map(
                  ({ userId, comment, createdAt }, index) => (
                    <div
                      key={index}
                      className="bg-background/30 p-4 border-2 border-input rounded-lg"
                    >
                      <div className="flex gap-3 capitalize font-bold">
                        <Link to={`/profile/${userId?._id}`} className="w-full">
                          <div className="flex gap-3 items-center text-sm ">
                            <img
                              className="w-8 aspect-square rounded-full ring-2 ring-secondary ring-offset-2 ring-offset-background/30"
                              src={
                                userId?.profileUrl ??
                                `https://api.dicebear.com/7.x/initials/svg?seed=${`${userId?.firstName} ${userId?.lastName}`}`
                              }
                              alt="avatar"
                            />
                            <div className="w-full leading-3">
                              <Link to={`/profile/${userId?._id}`}>
                                <div className=" font-bold flex text-xs  gap-2   capitalize items-center">
                                  {userId?.firstName}
                                  {userId?.lastName}
                                </div>
                                <div className="text-foreground/20 text-xs">
                                  {moment(createdAt).fromNow()}
                                </div>
                              </Link>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="font-sm  px-5 mt-4">{comment}</div>
                    </div>
                  )
                )}
              </div>
            )}
            {/* SHOW MORE BUTTON IF COMMENT EXIST  */}
            {post?.comments?.length > 0 && (
              <CustomButton
                styles={`text-xs w-full rounded-sm  mt-2  py-1`}
                title={
                  showComments[post._id] ? "Hide Comments" : "Show Comments"
                }
                btnAttribute={{
                  onClick: async () => {
                    if (!showComments[post._id]) {
                      try {
                        const data = await fetchSinglePost({
                          token,
                          postId: post._id,
                        });
                        dispatch(replacePost(data));
                      } catch (error) {
                        console.error("Error fetching single post:", error);
                      }
                    }
                    toggleComments(post._id);
                  },
                }}
              />
            )}
          </div>
        );
      })}
      {totalPost > posts.length && (
        <button
          onClick={() => setPage(page + 1)}
          className="bg-primary text-primary-foreground font-bold text-xs p-3 rounded-lg "
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default AllPost;
