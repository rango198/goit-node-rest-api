import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import gravatar from "gravatar";

import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import sendEmail from "../helpers/sendEmail.js";

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email, {
    protocol: "https",
    s: "200",
    r: "pg",
    d: "mm",
  });

  const verificationCode = nanoid();

  const newUser = await authServices.register({
    ...req.body,
    avatarURL,
    verificationCode,
  });
  if (!newUser) {
    throw HttpError(404, "Not found");
  }
  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${PROJECT_URL}/api/users/verify/${verificationCode}" target="_blank">Click to verify email</a>`,
  };

  await sendEmail(mail);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await authServices.findUser({ verificationCode });
  if (!user) {
    throw HttpError(404, "Email not found or already verified");
  }
  await authServices.updateUser(user._id, {
    verify: true,
    verificationCode: "",
  });
  res.status(200).json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${PROJECT_URL}/api/users/verify/${user.verificationCode}" target="_blank">Click to verify email</a>`,
  };

  await sendEmail(mail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await authServices.validatePassword(
    password,
    user.password
  );
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await authServices.updateUser(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser(_id, { token: "" });

  res.status(204).json();
};

const updateSubscriptionUsers = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await authServices.updateSubscription(_id, { subscription });

  res.status(200).json({ message: `Subscription changed to ${subscription}` });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscriptionUsers: ctrlWrapper(updateSubscriptionUsers),
};
