import jwt from "jsonwebtoken";

import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import jimp from "jimp";

import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import Jimp from "jimp";
import { User } from "../modals/User.js";

const { SECRET_KEY } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const changeAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, "Please add an image");
  }
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);

  Jimp.read(newPath)
    .then((filename) => {
      return filename.resize(250, 250).write(newPath);
    })
    .catch((error) => {
      console.error(error);
    });

  const avatarsURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarsURL });
  res.json({ avatarsURL });
};

const register = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await authServices.register(req.body);
  if (!newUser) {
    throw HttpError(404, "Not found");
  }
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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
  changeAvatar: ctrlWrapper(changeAvatar),
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscriptionUsers: ctrlWrapper(updateSubscriptionUsers),
};
