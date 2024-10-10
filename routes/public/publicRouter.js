import express from "express";
import crypto from "crypto";
import axios from "axios";
import { faker } from "@faker-js/faker";
import verifyToken from "../../middleware/verifyToken.js";
import dotenv from "dotenv";
dotenv.config();

const publicRouter = express.Router();

publicRouter.get("/features", verifyToken, (req, res) => {
  res.send("This is a public route accessible to everyone.");
});

publicRouter.get(
  "/features/generate-secured-password",
  verifyToken,
  (req, res) => {
    const length = 12;
    const password = crypto.randomBytes(length).toString("hex");

    res.status(200).json({ securedPassword: password });
  }
);

publicRouter.get(
  "/features/generate-fictive-identity",
  verifyToken,
  (req, res) => {
    const fakeIdentity = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        country: faker.address.country(),
      },
      birthdate: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      avatar: faker.image.avatar(),
    };

    res.status(200).json({ identity: fakeIdentity });
  }
);

publicRouter.post("/features/verify-email", verifyToken, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const apiKey = process.env.HUNTER_API_KEY;
    const response = await axios.get(
      `https://api.hunter.io/v2/email-verifier`,
      {
        params: {
          email,
          api_key: apiKey,
        },
      }
    );

    if (response.data && response.data.data) {
      const verificationResult = response.data.data;
      res.status(200).json({
        message: "Email verification completed",
        result: verificationResult,
      });
    } else {
      res.status(400).json({ message: "Invalid email or verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while verifying the email",
      error: error.message,
    });
  }
});

export default publicRouter;
