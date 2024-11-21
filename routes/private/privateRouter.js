import express from "express";
import emailSpammer from "../private/features/emailSpammer.js";

const privateRouter = express.Router();

privateRouter.get("/home", (req, res) => {
  res.send(`Hello ${req.user.firstName}, you are an Admin!`);
});

privateRouter.use("/", emailSpammer);

export default privateRouter;
