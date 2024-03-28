import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import isCheckBody from "../middleware/isCheckBody.js";
import isValidId from "../middleware/isValidId.js";
import authenticate from "../middleware/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../Schema/contactsSchema.js";
import upload from "../middleware/upload.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post(
  "/",
  isCheckBody,
  validateBody(createContactSchema),
  contactsControllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  isCheckBody,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isCheckBody,
  validateBody(updateFavoriteSchema),
  contactsControllers.updateFavorite
);

export default contactsRouter;
