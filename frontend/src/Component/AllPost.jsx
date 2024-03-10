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
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState({});

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
          <Animation key={index} index={index}>
            <div className="bg-secondary/80 backdrop-blur-lg  rounded-lg border p-3 text-foreground">
              {/* HEADER POST */}
              <div className="p-3 flex items-center">
                <Link to={`/profile/${post?.userId?._id}`} className="w-full">
                  <div className="flex gap-3 items-center text-sm">
                    <img
                      className=" rounded-full overflow-hidden w-8 h-8 aspect-square"
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
                      <div className="text-[gray] text-xs">
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
                    <FaRegTrashAlt />
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
                    <img
                      src={post?.image}
                      className="w-full"
                      alt={"postImage"}
                    />
                  </div>
                )}
              </div>
              {/* CONTENT LIKE OR COMMENT TOTAL */}
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
              {/* FOOTER OR COMMENT SECTION */}
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
              {/* COMMENT FORM INPUT FIELD  */}
              {post?._id == showIdComment && (
                <form
                  onSubmit={handleSubmit(async ({ comment }) => {
                    mCommentPost({ token, postId: post._id, comment });
                  })}
                  className="flex gap-2 items-center justify-center"
                >
                  <img
                    className="p-1 rounded-full overflow-hidden w-10 aspect-square"
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
                  />
                </form>
              )}
              {/* SINGLE POST COMMENT  */}
              {showComments[post._id] && post?.comments?.length > 0 && (
                <div>
                  {post?.comments?.map(
                    ({ userId, comment, createdAt }, index) => (
                      <div key={index} className="my-2 relative   text-xs ">
                        <div className="flex gap-3 capitalize font-bold">
                          <Link
                            to={`/profile/${userId?._id}`}
                            className="w-full"
                          >
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
                                  {userId?.firstName}
                                  {userId?.lastName}
                                </div>
                                <div className="text-[gray] text-xs">
                                  {moment(createdAt).fromNow()}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className="font-sm text-[#616161] px-5 py-3 border-b-2 border-[#c7c7c794]">
                          {comment}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
              {/* SHOW MORE BUTTON IF COMMENT EXIST  */}
              {post?.comments?.length > 0 && (
                <CustomButton
                  styles={`mt-5 w-full text-xs px-4 bg-[lightgray] text-[black] py-1 hover:bg-[gray] hover:text-[black] rounded-sm`}
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
              {/* Rest of your JSX */}
            </div>
          </Animation>
        );
      })}
      {totalPost > posts.length && (
        <button onClick={() => setPage(page + 1)}>Load More</button>
      )}
    </div>
  );
}

export default AllPost;