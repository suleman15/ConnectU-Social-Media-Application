import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { hashString } from "./index.js";
import Verification from "../models/emailVerificationModel.js";
import PasswordReset from "../Models/PasswordReset.js";
import path from "path";
import hbs from "nodemailer-express-handlebars";
dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL, FROM_USER } = process.env;

let transporter = nodemailer.createTransport({
  host: "smtp.google.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve("./views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views"),
  extName: ".hbs",
};

export const sendVerificationEmail = async (user, res) => {
  const { _id, email, lastName, firstName } = user;

  const token = _id + uuidv4();
  console.log(token);
  const link = APP_URL + "/users/verify/" + _id + "/" + token;
  //   mail options
  const mailOptions = {
    from: `${FROM_USER} <${AUTH_EMAIL}>`,
    to: email,
    subject: "Email Verification",
    template: "notify",
    context: {
      email,
      firstName,
      lastName,
      link,
    },

    // attachments: [
    //   {
    //     filename: "logo.svg",
    //     path: path.join(path.resolve("./views"), "logo.svg"),
    //     cid: "unique@logo.svg", //same cid value as in the html img src
    //   },
    // ],

    // html: `<div><img src="cid:unique@logo.svg" alt="not found"/></div>`,
    //     html: `<div
    //     style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
    //     <h3 style="color: rgb(8, 56, 188)">Please verify your email address</h3>
    //     <hr>
    //     <h4>Hi ${`${firstName} ${lastName} ${email}`},</h4>
    //     <p>
    //         Please verify your email address so we can know that it's really you.
    //         <br>
    //     <p>This link <b>expires in 1 hour</b></p>
    //     <br>
    //     <a href=${link}
    //         style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px;">Verify
    //         Email Address</a>
    //     </p>
    //     <div style="margin-top: 20px;">
    //         <h5>Best Regards</h5>
    //         <h5>Suleman Ahmed</h5>
    //     </div>
    // </div>`,
  };

  try {
    const hashedToken = await hashString(token);
    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    if (newVerifiedEmail) {
      transporter.use("compile", hbs(handlebarOptions));
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message:
              "Verification email has been sent to your account. Check your email for further instructions.",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ message: "Something went wrong" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const resetPasswordLink = async (user, res) => {
  const { _id, email } = user;
  const token = _id + uuidv4();
  console.log(token);
  const link = `${APP_URL}/users/reset-password/${_id}/${token}`;
  const mailOption = {
    from: `${FROM_USER} <${AUTH_EMAIL}>`,
    to: email,
    subject: "Password Reset",
    template: "resemail",
    context: {
      email,
      link,
    },
    // html: `
    // <div style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
    //   <h3 style="color: rgb(8, 56, 188)">Password reset link. Please click the link below to reset password.</h3>
    //   <hr>
    //   <p>

    //     <p>The Link expires in 10 Minutes</p>
    //     <br>
    //     <a href=${link}
    //     style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px;">Reset Your Password</a>
    //   </p>
    //   <div style="margin-top: 20px;">
    //     <h5>Best Regards</h5>
    //     <h5>Suleman Ahmed</h5>
    //   </div>
    // </div>`,
  };

  try {
    const hashedToken = await hashString(token);
    const emailReset = await PasswordReset.create({
      userId: _id,
      email,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 6000000,
    });
    if (emailReset) {
      transporter.use("compile", hbs(handlebarOptions));
      transporter
        .sendMail(mailOption)
        .then(() => {
          res.status(201).send({
            success: "Pending",
            message: "Reset Password Link has been sent to your account",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({
            message: "Some thing went wrong.",
          });
        });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Some thing went wrong.",
    });
  }
};
