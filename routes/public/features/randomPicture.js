import express from "express";

const router = express.Router();

/**
 * @swagger
 * /public/features/random-picture:
 *   get:
 *     summary: Get a random AI-generated picture URL
 *     description: Fetches a random image URL from the "thispersondoesnotexist.com" API.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                   description: URL of the generated picture.
 *                   example: https://thispersondoesnotexist.com/image
 */
router.get("/features/random-picture", (req, res) => {
  const imageUrl = "https://thispersondoesnotexist.com/image";

  res.status(200).json({ imageUrl });
});

export default router;
