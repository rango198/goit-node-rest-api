import express from "express";
import ctrl from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../modals/contact.js";
import isCheckBody from "../middleware/isCheckBody.js";
import isValidId from "../middleware/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", ctrl.getAllContacts);

contactsRouter.get("/:id", isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", isValidId, ctrl.deleteContact);

contactsRouter.post(
  "/",
  isCheckBody,
  validateBody(createContactSchema),
  ctrl.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  isCheckBody,
  validateBody(updateContactSchema),
  ctrl.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isCheckBody,
  validateBody(updateFavoriteSchema),
  ctrl.updateFavorite
);

export default contactsRouter;
