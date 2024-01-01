import express from "express";
import { userAuth } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPost,
  getPosts,
  userPost,
  likePost,
  deletePost,
  commentPost,
} from "../controllers/postController.js";
import { getComment } from "../controllers/getComment.js";

const router = express.Router();
//creating Post
router.post("/create-post", userAuth, createPost);

// // //Getting Post
router.post("/", userAuth, getPosts); //Getting all the post first owns the friends and then others
// router.post("/", getPosts); //Getting all the post first owns the friends and then others
// router.post("/:id", userAuth, getPost); //getting single post with the help of _id

// // Getting User Post
// router.post("/get-user-post/:id", userAuth, userPost);

router.post("/like", userAuth, likePost);

router.post("/delete", userAuth, deletePost);

//creating post
router.post("/comment/:postId", userAuth, commentPost);
// //Getting Comment
router.post("/comments/:postId", userAuth, getComment);

export default router;
