import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";
import { setUpdateSettings } from "./hooks.js";

const userSchema = new Schema(
  {
    password: {
      type: String,
      minLength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handleMongooseError);

export const User = model("user", userSchema);
