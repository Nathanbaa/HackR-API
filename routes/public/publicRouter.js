import express from "express";
import verifyToken from "../../middleware/verifyToken.js";

const publicRouter = express.Router();

publicRouter.get("/home", verifyToken, (req, res) => {
  res.send("This is a public route accessible to everyone.");
});

export default publicRouter;
