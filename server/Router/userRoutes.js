import express from "express";
import path from "path";
import {
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
  suggestedFriends,
  viewProfile,
  sentFriendRequest,
  cancelUserSentRequest,
  updateSocial,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/authMiddleware.js";
import scriptMiddleware from "../middleware/scriptMiddleware.js";
import { upload } from "../Utils/index.js";

const router = express.Router();

router.get("/verify/:userId/:token", verifyEmail); //@{for verification if the user has expire token or not expire}

//Reset Password Routes
router.post("/request-resetpassword", requestPasswordReset); // @{Working Fine} to send email for forget password
router.get("/reset-password/:userId/:token", resetPassword); // @{Working Fine} for redirect to especific path through provided params
router.post("/password-reset", changePassword); // @{Working Fine} change the user password through form

// GET USER // CHECKED
router.post("/get-user/:id?", userAuth, getUser);

router.put(
  "/update-user",
  upload.fields([
    { name: "profileUrl", maxCount: 1 },
    { name: "backgroundUrl", maxCount: 1 },
  ]),
  userAuth,
  updateUser
);

//UPDATE SOCIAL INFO OF THE USER PROFILE // CHECKED
router.put("/update-social", userAuth, updateSocial);

//friendrequest route
router.post("/friend-request", userAuth, friendRequest);

// GET ALL THE FRIEND REQUEST TO YOU
router.post("/get-friend-request", userAuth, getFriendRequest);

// SENT ALL THE FRIEND REQUEST TO YOU
router.post("/sent-friend-request", userAuth, sentFriendRequest);

router.post("/cancel-friend-request", userAuth);

router.post("/cancel-user-request", userAuth, cancelUserSentRequest);

// accept or deny friend request
router.post("/accept-request", userAuth, acceptRequest);

//PROFILE VIEW
router.post("/profile-view", userAuth, viewProfile);

//SUGGESTED FRIENDS // CHECKED
router.post("/suggested-friends", userAuth, suggestedFriends);

router.get("/verified", scriptMiddleware, (req, res) => {
  res.render("VerifiedPage");
}); //@{Working Fine}
router.get("/resetpassword", scriptMiddleware, (req, res) => {
  res.render("ResetPassword");
}); //@{not full set}

export default router;
