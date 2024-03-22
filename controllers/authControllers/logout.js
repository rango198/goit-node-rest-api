import HttpError from "../../helpers/HttpError.js";
import ctrWrapper from "../../helpers/ctrWrapper.js";
import { User } from "../../modals/user.js";

const logout = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findOneAndUpdate(_id, { token: "" });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(204).json({
    message: "Logout succsess",
  });
};
export default { logout: ctrWrapper(logout) };
