import express from "express";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /public/features/crawl-person:
 *   get:
 *     summary: Crawl information about a person
 *     description: Fetches information about a person based on their name and additional details using SerpAPI.
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         required: true
 *         description: The first name of the person to search for.
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         required: true
 *         description: The last name of the person to search for.
 *       - in: query
 *         name: moreDetail
 *         schema:
 *           type: string
 *         required: false
 *         description: Additional keywords for refining the search.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   description: List of search results.
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       link:
 *                         type: string
 *                       snippet:
 *                         type: string
 */
router.get("/features/crawl-person", async (req, res) => {
  const { firstName, lastName, moreDetail } = req.query;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "firstName and lastName are required." });
  }

  const apiKey = process.env.SERPAPI_KEY;
  const query = `${firstName} ${lastName} ${moreDetail || ""}`.trim();

  try {
    // Make a request to SerpAPI
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: query,
        api_key: apiKey,
        engine: "google", // Use Google search
      },
    });

    const results =
      response.data.organic_results?.map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      })) || [];

    res.status(200).json({ results });
  } catch (error) {
    console.error("Error fetching data from SerpAPI:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch information about the person." });
  }
});

export default router;
