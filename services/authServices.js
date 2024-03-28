import bcrypt from "bcrypt";
import gravatar from "gravatar";

import { User } from "../modals/User.js";

export const findUser = (filter) => User.findOne(filter);

export const register = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  const avatarURL = gravatar.url(data.email);
  console.log(avatarURL);

  return User.create({
    ...data,
    avatarURL,
    password: hashPassword,
  });
};
// function getAvatarUrl(email) {
//   return gravatar.url(email, { s: "200", r: "pg", d: "identicon" }, true);
// }

export const validatePassword = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateSubscription = (filter, data) =>
  User.findOneAndUpdate(filter, data);
