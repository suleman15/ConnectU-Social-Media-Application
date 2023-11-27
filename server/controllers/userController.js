import PasswordReset from "../Models/PasswordReset.js";
import Users from "../Models/userModel.js";
import { compareString, hashString } from "../Utils/index.js";
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
    console.log('Working')
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

    const resetPassword = await PasswordReset.findOne({ userId });

    if (!resetPassword) {
      const message = "Invalid Password reset Link. Try again";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    }

    const { expiresAt, token: resetToken } = resetPassword;

    if (expiresAt < Date.now()) {
      const message = "Reset Password Link has expired. Please try again.";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);
      if (!isMatch) {
        const message = "Invalid reset Link. Please try again later";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
      } else {
        res.redirect(`/users/resetpassword?type=reset&message${userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
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
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "Auth Error",
      success: false,
      error: error.message,
    });
  }
};
export const updateUser = async (req, res) => {};
