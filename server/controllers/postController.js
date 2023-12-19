import Comments from "../Models/commentsModel.js";
import Posts from "../Models/postModel.js";
import Users from "../Models/userModel.js";

export const createPost = async (req, res, next) => {
  try {
    const  userId  = "658047c723c92a79a8474f6d";
    const { description, image } = req.body;

    if (!description) {
      next("You must provide the description ");
      return;
    }

    const post = await Posts.create({
      userId,
      description,
      image,
    });
    res.status(200).json({
      success: true,
      message: "Success Added Post",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const  userId  = "658047c723c92a79a8474f6d";

    // const { userId } = req.body.user;
    const { search } = req.body;
    const user = await Users.findById(userId);
    const friends = user?.friends?.toString().split(",") ?? [];
    friends.push(userId);

    const searchPostQuery = {
      $or: [{ description: { $regex: search, $option: "i" } }],
    };
    const posts = await Posts.find(search ? searchPostQuery : {})
      .populate({
        path: "userId",
        select: "firstName lastName location  profileUrl -password",
      })
      .sort({ _id: -1 });

    const friendsPost = posts?.filter((post) => {
      return friends.includes(post?.userId?._id.toString());
    });

    const otherPost = posts?.filter(
      (post) => !friends.includes(post?.userId?._id.toString())
    );

    let postRes = null;

    if (friendsPost?.length > 0) {
      postRes = search ? friendsPost : [...friendsPost, ...otherPost];
    } else {
      postRes = posts;
    }

    res.json({ success: true, message: "Successfully", data: postRes });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById(id).populate({
      path: "userId",
      select: "firstName lastName location profileUrl -password",
    });
    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "userId",
    //     select: "firstName lastName location profileUrl -password",
    //     options: { sort: "-_id" },
    //   },
    // });
    // .populate({
    //   path: "comments",
    //   populate: {
    //     path: "replies.userId",
    //     select: "firstName lastname location profileUrl -password",
    //   },
    // });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const userPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Posts.find({ userId: id })
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postComments = await Comments.findById(postId);
    // .populate({
    //   path: "userId",
    //   select: "firstName lastName location profileUrl -password",
    // })
    // // .populate({
    // //   path: "replies.userId",
    // //   select: "firstName lastName location profileUrl -password",
    // // })
    // // .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      message: "Successfully",
      data: postComments,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};
