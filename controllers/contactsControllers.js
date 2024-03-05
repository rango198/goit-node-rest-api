import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, "Contact not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, "Contact  not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, "Contact  not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
