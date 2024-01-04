import mongoose, { Schema } from "mongoose";

let UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email Address is required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Email Address is required!"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    location: { type: String },
    profileUrl: { type: String },
    profession: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    views: [{ type: String }],
    verified: { type: Boolean, default: false },
    social: { facebook: String, instagram: String, github: String },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UserSchema);

export default Users;
