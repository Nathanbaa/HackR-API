import express from "express";
import axios from "axios";

const router = express.Router();

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
router.post("/features/domain-info", async (req, res) => {
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

export default router;
