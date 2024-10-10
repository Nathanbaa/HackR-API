import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";

const privateRouter = express.Router();

privateRouter.get("/home", verifyToken, verifyAdmin, (req, res) => {
  res.send(`Hello ${req.user.firstName}, you are an Admin!`);
});

export default privateRouter;
