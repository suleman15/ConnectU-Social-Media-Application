import { json } from "express";
import Comments from "../Models/commentsModel.js";
import Posts from "../Models/postModel.js";
import Users from "../Models/userModel.js";
import Async from "../middleware/Async.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const createPost = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { description } = req.body;
    const [image] = req.files;

    if (!description) {
      next("You must provide the description ");
      return;
    }

    let post;

    if (!image) {
      // Create post without image
      post = await Posts.create({
        userId,
        description,
      });
    } else {
      // Upload image to cloudinary
      const imageResponse = await cloudinary.uploader.upload(
        req.files[0]?.path
      );
      // Create post with image
      post = await Posts.create({
        userId,
        description,
        image: imageResponse.secure_url,
      });
      // Delete temporary file
      fs.unlink(req.files[0]?.path, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
        } else {
          console.log(
            `File ${req.files[0]?.path} has been deleted successfully.`
          );
        }
      });
    }

    // Fetch the created post with populated userId
    const populatedPost = await Posts.findById(post._id).populate(
      "userId",
      "firstName lastName location profileUrl profession -password"
    );

    const totalCount = await Posts.countDocuments({});

    res.status(200).json({
      success: true,
      message: "Success Added Post",
      data: { posts: populatedPost, totalCount },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

export const getPosts = Async(async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { search, page } = req.body;
    const user = await Users.findById(userId);

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const posts = await Posts.find(search ? { userId: search } : {})
      .populate({
        path: "userId",
        select: "firstName lastName location  profileUrl -password",
      })
      // .populate({
      //   path: "comments",
      //   populate: {
      //     path: "userId",
      //     select: "firstName lastName location profileUrl profession -password",
      //   },
      //   select: "userId comment createdAt updatedAt",
      // })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await Posts.countDocuments(
      search ? { userId: search } : {}
    );

    res.json({
      success: true,
      message: "Successfully",
      data: { posts, totalCount },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

export const getPost = Async(async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Posts.findById(id)
      .populate({
        path: "userId",
        select: "firstName lastName location profileUrl -password",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName location profileUrl -password",
          options: { sort: "-_id" },
        },
      });

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

export const userPost = Async(async (req, res, next) => {
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
});

export const getComment = Async(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postComments = await Comments.find();
    // .populate({
    //   path: "userId",
    //   select: "firstName lastName location profileUrl -password",
    // })
    // .sort({ _id: -1 });
    // // .populate({
    // //   path: "replies.userId",
    // //   select: "firstName lastName location profileUrl -password",
    // // })
    res.status(200).json({
      success: true,
      message: "Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});

export const likePost = Async(async (req, res, next) => {
  console.log("This is running like");
  try {
    const { userId } = req.body.user;
    const { postId } = req.params;

    const singlePost = await Posts.findById(postId);
    console.log(singlePost?.like.includes(userId));
    if (!singlePost?.like.includes(userId)) {
      singlePost?.like.push(userId);
      await singlePost.save();
      console.log(singlePost);
      res.json({ success: true, post: singlePost });
      return;
    } else {
      const updatedPost = await Posts.findByIdAndUpdate(
        postId,
        { $pull: { like: userId } },
        { new: true } // This option returns the updated document
      );
      res.json({ success: true, post: updatedPost });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
});
export const deletePost = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { postId, uId } = req.body;
    console.log("DELTE POST IS RUNNING");
    console.log(uId == userId);
    if (uId == userId) {
      const data = await Posts.findOneAndDelete({ _id: postId });
      res.status(200).json({
        success: true,
        data: data,
      });
    } else {
      res.status(200).json({
        success: "failed",
        message: "Dont Have Access",
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      errMsg: error.message,
    });
  }
});

//create comment
export const commentPost = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { postId } = req.params;
    const { comment } = req.body;
    console.log(userId, postId, comment);
    const createComment = await Comments.create({ userId, postId, comment });
    if (createComment) {
      const addPostComment = await Posts.findByIdAndUpdate(postId, {
        $push: {
          comments: {
            $each: [createComment?._id],
            $position: 0, // Insert at the beginning
          },
        },
      });
      res.json({ success: true, status: "Successfully", data: addPostComment });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({
      success: false,
      errMsg: error.message,
    });
  }
});
