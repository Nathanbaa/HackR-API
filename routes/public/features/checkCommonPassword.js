import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

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
router.post("/features/check-common-password", (req, res) => {
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
});

export default router;
