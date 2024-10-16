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

/**
 * @swagger
 * /public/features:
 *   get:
 *     summary: Test public route
 *     description: Returns a message that the route is public.
 *     responses:
 *       200:
 *         description: Success
 */
publicRouter.get("/features", verifyToken, (req, res) => {
  res.send("This is a public route accessible to everyone.");
});

/**
 * @swagger
 * /public/features/generate-secured-password:
 *   get:
 *     summary: Generate a secured password
 *     description: Generates a random secured password using crypto.
 *     responses:
 *       200:
 *         description: A secured password is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 securedPassword:
 *                   type: string
 *                   description: The generated secured password
 */
publicRouter.get(
  "/features/generate-secured-password",
  verifyToken,
  (req, res) => {
    const length = 12;
    const password = crypto.randomBytes(length).toString("hex");

    res.status(200).json({ securedPassword: password });
  }
);

/**
 * @swagger
 * /public/features/generate-fictive-identity:
 *   get:
 *     summary: Generate a fictive identity
 *     description: Generates a fake identity with name, email, phone, address, birthdate, and avatar using Faker.js.
 *     responses:
 *       200:
 *         description: A fictive identity is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 identity:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                         city:
 *                           type: string
 *                         country:
 *                           type: string
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                     avatar:
 *                       type: string
 */
publicRouter.get(
  "/features/generate-fictive-identity",
  verifyToken,
  (req, res) => {
    const fakeIdentity = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
      },
      birthdate: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      avatar: faker.image.avatar(),
    };

    res.status(200).json({ identity: fakeIdentity });
  }
);

/**
 * @swagger
 * /public/features/verify-email:
 *   post:
 *     summary: Verify email address
 *     description: Verify the existence of an email address using Hunter.io API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to verify
 *     responses:
 *       200:
 *         description: Email verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 */
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

/**
 * @swagger
 * /public/features/check-common-password:
 *   post:
 *     summary: Check if password is common
 *     description: Verifies if a password is too common by checking it against a list of common passwords.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Password to check
 *     responses:
 *       200:
 *         description: Password check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

/**
 * @swagger
 * /public/features/domain-info:
 *   post:
 *     summary: Retrieve domain and subdomains information
 *     description: Retrieves all subdomains associated with a given domain using the SecurityTrails API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 description: Domain name to retrieve subdomains for
 *     responses:
 *       200:
 *         description: List of subdomains
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 domain:
 *                   type: string
 *                 subdomains:
 *                   type: array
 *                   items:
 *                     type: string
 */
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
