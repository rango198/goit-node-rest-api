import express from "express";
import morgan from "morgan";
import cors from "cors";

import mongoose from "mongoose";

const DB_HOST =
  "mongodb+srv://DataBase:23pm89ecio@cluster0.5efshsq.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connect success");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

import contactsRouter from "./routes/contactsRouter.js";
import { error } from "console";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// app.listen(3000, () => {
//   console.log("Server is running. Use our API on port: 3000");
// });
