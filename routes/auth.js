import express from "express";

import authControllers from "../controllers/authControllers.js";

import contactsControllers from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";

import authenticate from "../middleware/authenticate.js";

import {
  userSignupSchema,
  userSigninSchema,
  updateSubscriptionSchema,
} from "../schema/userSchema.js";
import upload from "../middleware/upload.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSignupSchema),
  authControllers.register
);

authRouter.post(
  "/login",
  validateBody(userSigninSchema),
  authControllers.login
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionSchema),
  authControllers.updateSubscriptionUsers
);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  contactsControllers.changeAvatar
);

export default authRouter;
