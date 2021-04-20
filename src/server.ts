import express from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import cors from "cors";
import { Request, Response, NextFunction } from 'express';

import wilderController from "./controllers/wilders";

//Middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Database
mongoose
  .connect("mongodb://127.0.0.1:27017/wilderdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err: Error) => console.log(err));

  //routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/api/wilder/create", asyncHandler(wilderController.create));
app.get("/api/wilder/read", asyncHandler(wilderController.read));
app.put("/api/wilder/update", asyncHandler(wilderController.update));
app.delete("/api/wilder/delete", asyncHandler(wilderController.delete));

app.get("*", (req, res) => {
  res.status(404);
  res.json({ success: false, message: "Wrong adress" });
});

interface CustomError extends Error {
  code: number,
}

app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (error.name === "MongoError" && error.code === 11000) {
    res.status(400);
    res.json({ success: false, message: "The name is already used" });
  }
});

//Start Server
app.listen(5000, () => console.log("Server started on 5000"));