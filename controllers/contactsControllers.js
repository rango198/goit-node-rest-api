import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../helpers/ctrWrapper.js";
import * as contactsService from "../services/contactsServices.js";

const getAllContacts = async (_, res) => {
  const result = await contactsService.listContacts();
  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, "Contact not found");
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, "Contact  not found");
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, "Contact  not found");
  }
  res.json(result);
};

export default {
  getAllContacts: ctrWrapper(getAllContacts),
  getOneContact: ctrWrapper(getOneContact),
  deleteContact: ctrWrapper(deleteContact),
  createContact: ctrWrapper(createContact),
  updateContact: ctrWrapper(updateContact),
};
