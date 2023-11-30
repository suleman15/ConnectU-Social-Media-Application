import PasswordReset from "../Models/PasswordReset.js";
import FriendRequest from "../Models/friendRequest.js";
import Users from "../Models/userModel.js";
import { compareString, createJWT, hashString } from "../Utils/index.js";
import { resetPasswordLink } from "../Utils/sendEmail.js";
import Verification from "../models/emailVerificationModel.js";

export const verifyEmail = async (req, res) => {
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
};

export const requestPasswordReset = async (req, res) => {
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
};

export const resetPassword = async (req, res) => {
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
};

export const changePassword = async (req, res) => {
  console.log(req.body);
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
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;
    console.log("Working");
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
};
export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, location, profileUrl, profession } = req.body;
    if (!(firstName || lastName || location || profileUrl || profession)) {
      next("Please Provide all required Field");
      return;
    }
    const { userId } = req.params;
    const updatedUser = {
      _id: userId,
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
    };
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
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err.message });
  }
};

export const friendRequest = async (req, res, next) => {
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
};
export const getFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "Pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName profileUrl profession -password",
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
};
export const acceptRequest = async (req, res, next) => {
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
      message: "Frined Request " + status,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Auth Error", success: false, error: err.message });
  }
};

export const profileView = async (res, req, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.body;
    const user = await Users.findById(id);

    user.views.push(userId);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Successfully",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Auth Error", success: false, error: err.message });
  }
};

export const suggestedFriends = async (res, req, next) => {
  try {
    const { userId } = req.body.user;
    let queryObj = {};
    queryObj._id = { $ne: userId };
    queryObj.friends = { $nin: userId };
    let queryResult = Users.find(queryObj)
      .limit(15)
      .select("firstName lastName profileUrl profesion -password");

    const suggestedFriends = await queryResult;

    res.status(200).json({
      success: true,
      data: suggestedFriends,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Auth Error", success: false, error: err.message });
  }
};
