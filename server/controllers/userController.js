import multer from "multer";
import PasswordReset from "../Models/PasswordReset.js";
import FriendRequest from "../Models/friendRequest.js";
import Users from "../Models/userModel.js";
import { compareString, createJWT, hashString } from "../Utils/index.js";
import { resetPasswordLink } from "../Utils/sendEmail.js";
import Async from "../middleware/Async.js";
import Verification from "../Models/emailVerificationModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { request } from "http";

export const verifyEmail = Async(async (req, res) => {
  const { userId, token } = req.params;
  try {
    const result = await Verification.findOne({ userId });

    if (result) {
      const { expiresAt, token: hashedToken } = result;

      // token has expires
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            Users.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = "Verification token has expired.";
                res.redirect(`/users/verified?status=error&message=${message}`);
              })
              .catch((err) => {
                res.redirect(`/users/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?message=`);
          });
      } else {
        //token valid
        compareString(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              Users.findOneAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = "Email verified successfully";
                    res.redirect(
                      `/users/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = "Verification failed or link is invalid";
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              // invalid token
              const message = "Verification failed or link is invalid";
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/users/verified?message=`);
          });
      }
    } else {
      const message = "Invalid verification link. Try again later.";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(err);
    res.redirect(`/users/verified?message=`);
  }
});

export const requestPasswordReset = Async(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Email Address not Found.",
      });
    }

    const existRequest = await PasswordReset.findOne({ email });
    if (existRequest) {
      if (existRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "Pending",
          message: "Reset Password Already be sent  to your email before.",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(user, res);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

export const resetPassword = Async(async (req, res) => {
  const { userId, token } = req.params;
  try {
    const user = await Users.findById(userId);
    if (!user) {
      const message = "Invalid Password reset Link. Try again";
      res.redirect(
        `/users/resetpassword?type=reset&status=error&message=${message}`
      );
    }

    const passwordReset = await PasswordReset.findOne({ userId });

    if (!passwordReset) {
      const message = "Invalid Password reset Link. Try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    }

    const { expiresAt, token: resetToken } = passwordReset;

    if (expiresAt < Date.now()) {
      const message = "Reset Password Link has expired. Please try again.";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);
      if (!isMatch) {
        const message = "Invalid reset Link. Please try again later";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      } else {
        res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

export const changePassword = Async(async (req, res) => {
  try {
    const { userId, password } = req.body;
    const hashedPassword = await hashString(password);
    const user = await Users.findByIdAndUpdate(
      { _id: userId },
      { password: hashedPassword }
    );
    if (user) {
      await PasswordReset.findOneAndDelete({ userId });
      const message = "Password Successfully Reset";
      res.redirect(`/user/resetpassword?status=success&message=${message}`);
      return;
    }
    res.json({
      success: false,
    });
  } catch (error) {
    console.log("error");
    res.status(404).send({ message: error.message });
  }
});

export const getUser = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      select: "-password",
    });
    if (!user) {
      return res.status(200).send({
        message: "User not Found.",
        success: false,
      });
    }
    user.password = undefined;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Auth Error",
      success: false,
      error: error.message,
    });
  }
});
export const updateSocial = Async(async (req, res, next) => {
  try {
    const { user, ...result } = req.body;
    console.log(req.body);
    const findUser = await Users.findByIdAndUpdate(
      user?.userId,
      { social: { ...result } },
      {
        new: true,
      }
    );
    console.log(findUser);
    await findUser.populate({ path: "friends", select: "-password" });
    const token = createJWT(user?.userId);
    findUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      findUser,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
});
export const updateUser = Async(async (req, res, next) => {
  try {
    const { firstName, lastName, location, profession } = req.body;

    const { profileUrl, backgroundUrl } = req.files; // Use req.files instead of req.file to access uploaded files

    // Check if any required fields are provided
    if (!(firstName || lastName || location || profession)) {
      next("Please Provide all required Field");
      return;
    }

    // Check if both profile picture and background image are provided
    if (!profileUrl || !backgroundUrl) {
      next("Please provide both profile picture and background image.");
      return;
    }

    // Upload profile picture to Cloudinary
    const profileResult = await cloudinary.uploader.upload(profileUrl[0].path);
    console.log(profileResult.secure_url);

    // Upload background image to Cloudinary
    const backgroundResult = await cloudinary.uploader.upload(
      backgroundUrl[0].path
    );
    console.log(backgroundResult.secure_url);

    const { userId } = req.body.user;

    // Create an updated user object
    const updatedUser = {
      _id: userId,
      firstName,
      lastName,
      location,
      profileUrl: profileResult.secure_url,
      backgroundUrl: backgroundResult.secure_url,
      profession,
    };

    // Update the user in the database
    const user = await Users.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

    await user.populate({ path: "friends", select: "-password" });

    const token = createJWT(user?._id);
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      user,
      token,
    });
    // Optionally, you can delete the temporary files on your server
    fs.unlink(profileUrl[0].path);
    fs.unlink(backgroundUrl[0].path);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }

  // try {
  //   const { firstName, lastName, location, profession } = req.body;
  //   const { profileUrl, backgroundUrl } = req.file;
  //   if (!(firstName || lastName || location || profileUrl || profession)) {
  //     next("Please Provide all required Field");
  //     return;
  //   }
  //   // Check if both profile picture and background image are provided
  //   if (!profileUrl || !backgroundUrl) {
  //     next("Please provide both profile picture and background image.");
  //     return;
  //   }

  //   console.log(profileUrl.path);

  //   cloudinary.uploader
  //     .upload(profileUrl.path)
  //     .then(async (result) => {
  //       const { userId } = req.body.user;

  //       const updatedUser = {
  //         _id: userId,
  //         firstName,
  //         lastName,
  //         location,
  //         profileUrl: result.secure_url,
  //         profession,
  //       };
  //       const user = await Users.findByIdAndUpdate(userId, updatedUser, {
  //         new: true,
  //       });
  //       await user.populate({ path: "friends", select: "-password" });
  //       const token = createJWT(user?._id);
  //       user.password = undefined;
  //       res.status(200).json({
  //         success: true,
  //         message: "User Updated Successfully",
  //         user,
  //         token,
  //       });
  //       // fs.unlink(profileUrl.path);
  //     })
  //     .catch((err) => res.json({ err: "err in cloudinary catch fn" }));
  // } catch (err) {
  //   console.log(err);
  //   res.status(404).json({ message: err.message });
  // }
});

export const friendRequest = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo,
    });
    if (requestExist) {
      next("Friend Request Already Exist");
      return;
    }
    const accountExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: userId,
    });
    if (accountExist) {
      next("Friend Request Already Exist");
      return;
    }

    const newReq = await FriendRequest.create({
      requestTo,
      requestFrom: userId,
    });
    res.status(201).json({
      success: true,
      message: "Friend Request Sent Successfully",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Auth Error", success: false, error: err.message });
  }
});
export const getFriendRequest = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileUrl profession verified -password",
      })
      .limit(10)
      .sort({
        _id: -1,
      });
    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Auth Error", success: false, error: err.message });
  }
});
export const acceptRequest = Async(async (req, res, next) => {
  //accept friend request and push in to both send and accepter
  try {
    const id = req.body.user.userId;
    const { rid, status } = req.body;
    const requestExist = await FriendRequest.findById(rid);
    if (!requestExist) {
      next("No Frind Request Found");
      return;
    }
    const newRes = await FriendRequest.findByIdAndUpdate(
      { _id: rid },
      { requestStatus: status }
    );
    if (status == "Accepted") {
      const user = await Users.findById(id);
      user.friends.push(newRes?.requestFrom);
      await user.save();
      const friend = await Users.findById(newRes?.requestFrom);
      friend.friends.push(newRes?.requestTo);
      await friend.save();
    }
    res.status(200).json({
      success: true,
      // message: "Frined Request " + status,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Auth Error", success: false, error: err.message });
  }
});

export const viewProfile = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.body;
    const user = await Users.findById(id);
    if (user) {
      if (!user?.views.includes(userId)) {
        user?.views.push(userId);
        await user.save();
        res.status(201).json({
          success: true,
          message: "Successfully",
        });
        return;
      } else {
        return res.status(200).json({
          success: false,
          message: "User already viewed the profile",
        });
      }
    }
    res
      .status(401)
      .json({ success: false, message: "id is not defined in body" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
});

export const suggestedFriends = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const suggestFriend = await FriendRequest.find({
      requestFrom: userId,
      // requestStatus: "Accepted",
    })
      .select("requestTo")
      .lean()
      .then((requests) => requests.map((request) => request.requestTo));
    const alpha = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .select("requestFrom")
      .lean()
      .then((requests) => requests.map((request) => request.requestFrom));

    const user = await Users.find({
      _id: { $nin: [...suggestFriend, ...alpha], $ne: userId },
      friends: { $nin: userId },
    }).then(async (res) => {
      return res;
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Auth Error",
      success: false,
      error: error.message,
    });
  }
});

export const sentFriendRequest = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const div = await FriendRequest.find({
      requestFrom: userId,
      requestStatus: "Pending",
    }).populate({
      path: "requestTo",
      select: "firstName lastName profileUrl profession -password",
    });

    res.status(200).json({
      success: true,
      data: div,
    });
  } catch (error) {
    res.status(500).json({
      message: "Auth Error",
      success: false,
      error: error.message,
    });
  }
});

export const cancelUserSentRequest = Async(async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { requestTo } = req.body;

    const cancel = await FriendRequest.findOneAndDelete({
      requestTo,
      requestStatus: "Pending",
    });

    const div = await FriendRequest.find({
      requestFrom: userId,
      requestStatus: "Pending",
    }).populate({
      path: "requestTo",
      select: "firstName lastName profileUrl profession -password",
    });

    res.status(200).json({
      success: true,
      data: div,
    });
  } catch (error) {
    res.status(500).json({
      message: "Auth Error",
      success: false,
      error: error.message,
    });
  }
});
