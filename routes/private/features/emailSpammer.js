import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

/**
 * @swagger
 * /private/features/email-spammer:
 *   post:
 *     summary: Email spammer
 *     description: Sends a certain number of emails to a given address with the provided content.
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
router.post("/features/email-spammer", async (req, res) => {
  const { email, content, nbSend = 1 } = req.body;

  if (!email || !content || !nbSend) {
    return res
      .status(400)
      .json({ message: "Email, content, and nbSend are required" });
  }

  if (nbSend > 10) {
    return res
      .status(400)
      .json({ message: "Maximum 10 emails allowed to be sent at once." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Not a spammm",
    text: content,
  };

  try {
    for (let i = 0; i < nbSend; i++) {
      await transporter.sendMail(mailOptions);

      console.log(`Email ${i + 1} sent to ${email}`);
    }

    res
      .status(200)
      .json({ message: `${nbSend} emails successfully sent to ${email}` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending emails", error: error.message });
  }
});

export default router;
