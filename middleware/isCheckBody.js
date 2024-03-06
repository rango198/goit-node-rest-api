import HttpError from "../helpers/HttpError.js";

const isCheckBody = async (req, res, next) => {
  const result = Object.keys(req.body);
  if (!result.length) {
    return next(HttpError(400, "Body must have at least one field"));
  }
  next();
};
export default isCheckBody;
