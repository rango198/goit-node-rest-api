import ctrWrapper from "../../helpers/ctrWrapper.js";

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};
export default { getCurrent: ctrWrapper(getCurrent) };
