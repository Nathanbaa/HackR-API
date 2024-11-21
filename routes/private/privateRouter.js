import express from "express";
import emailSpammer from "../private/features/emailSpammer.js";
import Log from "../../models/log.js";
import verifyToken from "../../middleware/verifyToken.js";

const privateRouter = express.Router();

privateRouter.get("/home", (req, res) => {
  res.send(`Hello ${req.user.firstName}, you are an Admin!`);
});

/**
 * @swagger
 * /private/logs:
 *   get:
 *     summary: Fetch logs with pagination
 *     description: Retrieve logs in a paginated format. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       feature:
 *                         type: string
 *                       success:
 *                         type: boolean
 *                       duration:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
privateRouter.get("/logs", verifyToken, async (req, res) => {
  const { page = 1 } = req.query;
  const pageSize = 5;

  try {
    const totalLogs = await Log.countDocuments();

    const totalPages = Math.ceil(totalLogs / pageSize);

    const logs = await Log.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(
        "userId userFirstName userEmail url success duration timestamp errorMessage"
      );

    res.status(200).json({
      currentPage: parseInt(page),
      totalPages,
      logs,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des logs :", error);

    res.status(500).json({ message: "Erreur serveur" });
  }
});

privateRouter.use("/", emailSpammer);

export default privateRouter;
