import Users from "../Models/userModel.js";
import { hashString, compareString, createJWT } from "../Utils/index.js";

import { sendVerificationEmail } from "../Utils/sendEmail.js";
import Async from "../middleware/Async.js";

export const register = Async(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  //validate field
  if (!(firstName || lastName || email || password)) {
    next("Provide Required Fields!");
    return;
  }
  try {
    const userExist = await Users.findOne({ email });
    if (userExist) {
      next("Email Address already exists");
      return;
    }
    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    sendVerificationEmail(user, res);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export const Login = Async(async (req, res, next) => {
  console.log("LOGIN BLOCK START");
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      next("Please Provide User Credencial");
      return;
    }
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });
    if (!user) {
      next("Email  Doesn,t exist");
      return;
    }
    // if (!user?.verified) {
    //   next(
    //     "User email is not verified. Check your email account and verify your email"
    //   );
    //   return;
    // }
    const isMatch = await compareString(password, user?.password);
    if (!isMatch) {
      next("Invalid Password");
      return;
    }
    user.password = undefined;

    const token = createJWT(user._id);
    console.log(token);
    res.status(201).json({
      success: true,
      message: "Login Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ Success: false, message: "Something went wrong" });
  }
});
