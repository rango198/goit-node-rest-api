import Joi from "joi";

export const userSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().required(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().required(),
});
