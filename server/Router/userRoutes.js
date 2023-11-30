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
  profileView,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

router.get("/verify/:userId/:token", verifyEmail); //@{Working Fine}

//Reset Password Routes
router.post("/request-resetpassword", requestPasswordReset); // @{Working Fine} to send email for forget password
router.get("/reset-password/:userId/:token", resetPassword); // @{Working Fine} for redirect to especific path through provided params
router.post("/password-reset", changePassword); // @{Working Fine} change the user password through form

//user routes
router.post("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

//friendrequest route
router.post("/friend-request", userAuth, friendRequest);
router.post("/get-friend-request", userAuth, getFriendRequest);

// accept or deny friend request
router.post("/accept-request", userAuth, acceptRequest);

//View Profile
router.post("/profile-view", userAuth, profileView);

//Suggest Friend
router.post("/suggested-friends", userAuth, suggestedFriends);

router.get("/verified", (req, res) => {
  res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.join(__dirname, "views/build", "/verifiedPage.html"));
}); //@{Working Fine}
router.get("/resetpassword", (req, res) => {
  res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.join(__dirname, "views/build", "/resetPage.html"));
}); //@{not full set}

export default router;
