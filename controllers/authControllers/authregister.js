import bcrypt from "bcrypt";
import HttpError from "../../helpers/HttpError.js";
import ctrWrapper from "../../helpers/ctrWrapper.js";
import { User } from "../../modals/user.js";

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

export default {
  register: ctrWrapper(register),
};
