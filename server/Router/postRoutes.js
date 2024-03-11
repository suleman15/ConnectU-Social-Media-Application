import express from "express";
import { userAuth } from "../middleware/authMiddleware.js";
import { upload } from "../Utils/index.js";

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

//Create POST
router.post("/create-post", upload.array("image"), userAuth, createPost);

//Find 10 by 10 Post
router.post("/", userAuth, getPosts);

//Find Single Post
router.post("/:id", userAuth, getPost);

//Like Single Post
router.post("/like/:postId", userAuth, likePost);

//Delete Single Post
router.post("/delete/:postId", userAuth, deletePost);

//Comment Single Post
router.post("/comment/:postId", userAuth, commentPost);

//Get Single Post Comments
router.post("/comments/:postId", userAuth, getComment);

export default router;
