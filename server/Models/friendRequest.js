import { Schema, model } from "mongoose";

const requestSchema = Schema(
  {
    requestTo: { type: Schema.Types.ObjectId, ref: "Users" },
    requestFrom: { type: Schema.Types.ObjectId, ref: "Users" },
    requestStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const FriendRequest = model("FriendRequest", requestSchema);

export default FriendRequest;
