import { Schema, model } from "mongoose";
const passwordResetSchema = Schema({
  userId: { type: String, unique: true },
  email: { type: String, unique: true },
  token: String,
  createdAt: Date,
  expiresAt: Date,
});

const PasswordReset = model("PasswordReset", passwordResetSchema);

export default PasswordReset;
