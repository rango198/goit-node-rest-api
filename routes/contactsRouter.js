import express from "express";
import ctrl from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import isCheckBody from "../middleware/isCheckBody.js";
import isValidId from "../middleware/isValidId.js";
import authenticate from "../middleware/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../modals/contact.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrl.getAllContacts);

contactsRouter.get("/:id", authenticate, isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", authenticate, isValidId, ctrl.deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  isCheckBody,
  validateBody(createContactSchema),
  ctrl.createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  isCheckBody,
  validateBody(updateContactSchema),
  ctrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  isCheckBody,
  validateBody(updateFavoriteSchema),
  ctrl.updateFavorite
);

export default contactsRouter;
