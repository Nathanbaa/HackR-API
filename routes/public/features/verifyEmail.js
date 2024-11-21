import express from "express";
import axios from "axios";

const router = express.Router();

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
router.post("/features/verify-email", async (req, res) => {
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

export default router;
