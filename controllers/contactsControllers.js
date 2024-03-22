import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../helpers/ctrWrapper.js";
import Contact from "../modals/contact.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const filter = { owner, ...filterParams };

  const result = await Contact.find({ owner }, "createdAt -updateAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  const total = await Contact.countDocuments(filter);

  res.status(200).json(result, total);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: id, owner });
  if (!result) {
    throw HttpError(404, "Contact not found");
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, "Contact  not found");
  }
  res.json(result, { message: "Delete succsess" });
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findByIdAndUpdate({ _id: id, owner }, req.body);
  if (!result) {
    throw HttpError(404, "Contact  not found");
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Contact  not found");
  }
  res.status(200).json(result);
};

export default {
  getAllContacts: ctrWrapper(getAllContacts),
  getOneContact: ctrWrapper(getOneContact),
  deleteContact: ctrWrapper(deleteContact),
  createContact: ctrWrapper(createContact),
  updateContact: ctrWrapper(updateContact),
  updateFavorite: ctrWrapper(updateFavorite),
};
