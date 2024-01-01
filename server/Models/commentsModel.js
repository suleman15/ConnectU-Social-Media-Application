import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    postId: { type: Schema.Types.ObjectId, ref: "Posts" },
    comment: { type: String, required: true },
    // replies: [
    //   {
    //     rid: { type: mongoose.Schema.Types.ObjectId },
    //     userId: { type: Schema.Types.ObjectId, ref: "Users" },
    //     from: { type: String },
    //     replyAt: { type: String },
    //     comment: { type: String },
    //     created_at: { type: Date, default: Date.now() },
    //     updated_at: { type: Date, default: Date.now() },
    //     likes: [{ type: String }],
    //   },
    // ],
    likes: [{ type: String }],
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const Comments = mongoose.model("Comments", CommentSchema);

export default Comments;
