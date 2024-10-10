import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verifyToken.js";

const authRouter = express.Router();

const checkNotAuthenticated = (req, res, next) => {
  const token = req.cookies["auth-token"];

  if (token) {
    return res.status(403).json({ message: "You are already logged in." });
  }
  next();
};

authRouter.post("/register", checkNotAuthenticated, async (req, res) => {
  const { firstName, email, password } = req.body;

  try {
    const emailVerification = await User.findOne({ email });

    if (emailVerification)
      return res.status(400).json({ message: "Email already taken" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      first_name: firstName,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, firstName: user.first_name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

authRouter.post("/login", checkNotAuthenticated, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Email or Password incorrect" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(400).json({ message: "Email or Password incorrect" });

    const token = jwt.sign(
      { id: user._id, firstName: user.first_name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

authRouter.post("/logout", verifyToken, (req, res) => {
  res.clearCookie("auth-token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export default authRouter;
