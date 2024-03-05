import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import isCheckBody from "../middleware/isCheckBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post(
  "/",
  isCheckBody,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  isCheckBody,
  validateBody(updateContactSchema),
  updateContact
);

export default contactsRouter;
