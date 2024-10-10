import express from "express";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";
import path from "path";
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

const commonPasswordsPath = path.join(
  path.resolve(),
  "data",
  "common-passwords.txt"
);

const commonPasswords = fs
  .readFileSync(commonPasswordsPath, "utf-8")
  .split("\n")
  .map((password) => password.trim());

publicRouter.post(
  "/features/check-common-password",
  verifyToken,
  (req, res) => {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const isCommon = commonPasswords.includes(password);

    if (isCommon) {
      return res.status(200).json({
        message: "Password is too common, please choose a more secure one.",
      });
    }

    res.status(200).json({ message: "Password is secure." });
  }
);

publicRouter.post("/features/domain-info", verifyToken, async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ message: "Domain is required" });
  }

  try {
    const apiKey = process.env.SECURITYTRAILS_API_KEY;
    const response = await axios.get(
      `https://api.securitytrails.com/v1/domain/${domain}/subdomains`,
      {
        headers: {
          APIKEY: apiKey,
        },
      }
    );

    const subdomains = response.data.subdomains || [];

    const fullDomains = subdomains.map((subdomain) => `${subdomain}.${domain}`);

    res.status(200).json({
      domain: domain,
      subdomains: fullDomains,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching domain information",
      error: error.message,
    });
  }
});

export default publicRouter;
