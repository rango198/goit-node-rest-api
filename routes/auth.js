import express from "express";
import validateBody from "../helpers/validateBody.js";
import reg from "../controllers/authControllers/authregister.js";
import log from "../controllers/authControllers/login.js";
import isCheckBody from "../middleware/isCheckBody.js";
import { authSchema } from "../modals/user.js";
import authenticate from "../middleware/authenticate.js";
import authCurrent from "../controllers/authControllers/getCurrent.js";
import authLogout from "../controllers/authControllers/logout.js";

const router = express.Router();

router.post("/register", isCheckBody, validateBody(authSchema), reg.register);

router.post("/login", isCheckBody, validateBody(authSchema), log.login);

router.get("/current", authenticate, authCurrent.getCurrent);

router.post("/logout", authenticate, authLogout.logout);

export default router;
