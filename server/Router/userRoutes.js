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

//user routes
router.post("/get-user/:id?", userAuth, getUser); // get the user data from db
router.put("/update-user", upload.single("profileUrl"), userAuth, updateUser); //update the user info
// router.put("/update-user", userAuth, upload.single("profileUrl"), updateUser);

//friendrequest route
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);

// accept or deny friend request
router.post("/accept-request", userAuth, acceptRequest);

//View Profile
router.post("/profile-view", userAuth, viewProfile);

//Suggest Friend
router.post("/suggested-friends", userAuth, suggestedFriends);

router.get("/verified", scriptMiddleware, (req, res) => {
  res.render("VerifiedPage");
}); //@{Working Fine}
router.get("/resetpassword", scriptMiddleware, (req, res) => {
  res.render("ResetPassword");
}); //@{not full set}

export default router;
