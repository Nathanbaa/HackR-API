import express from "express";
import crypto from "crypto";

const router = express.Router();

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
router.get("/features/generate-secured-password", (req, res) => {
  const length = 12;
  const password = crypto.randomBytes(length).toString("hex");

  res.status(200).json({ securedPassword: password });
});

export default router;
