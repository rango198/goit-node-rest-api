import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import fs from "fs/promises";
import path from "path";

import Jimp from "jimp";
import { User } from "../modals/User.js";

const avatarsPath = path.resolve("public", "avatars");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const result = await contactsService.listContacts(
    // { owner, favorite },
    favorite ? { $and: [{ owner }, { favorite }] } : { owner },
    {
      skip,
      limit,
    }
  );
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.getContact({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.removeContact({ _id: id, owner });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { name, email, phone } = req.body;

  const existingContact = await contactsService.getContactByDetails({
    name,
    email,
    phone,
    owner,
  });

  if (existingContact) {
    return res.status(400).json({ message: "Contact already exists" });
  }

  let avatar;
  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);
    avatar = path.join("avatars", filename);
  }

  const newContactData = { ...req.body, owner };
  if (avatar) {
    newContactData.avatar = avatar;
  }

  const newContact = await contactsService.addContact(newContactData);
  if (!newContact) {
    throw HttpError(400);
  }

  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateContact(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateFavorite(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `contact ${id} Not found`);
  }
  res.status(200).json(result);
};
const changeAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  const img = await Jimp.read(tmpUpload);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(tmpUpload);

  const filename = `${Date.now()}-${originalname}`;
  const resultUpload = path.join(avatarsPath, filename);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

export default {
  changeAvatar: ctrlWrapper(changeAvatar),
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
