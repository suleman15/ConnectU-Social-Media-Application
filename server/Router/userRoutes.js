import express from "express";
import path from "path";
import {
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

router.get("/verify/:userId/:token", verifyEmail);

router.post("/request-resetpassword", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/password-reset", changePassword);

// router.post("/get-user/:id", userAuth, getUser);
// router.post("/update-user", userAuth, updateUser);

router.get("/verified", (req, res) => {
  res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.join(__dirname, "views/build", "/verifiedPage.html"));
});
router.get("/resetpassword", (req, res) => {
  res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.join(__dirname, "views/build", "/verifiedPage.html"));
});

export default router;
