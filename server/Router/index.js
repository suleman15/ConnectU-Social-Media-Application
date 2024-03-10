import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import postRoutes from "./postRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes); //working fine
router.use("/users", userRoutes);
router.use("/post", postRoutes);

export default router;
