import express from "express";

import generateSecuredPassword from "./features/generateSecuredPassword.js";
import generateFictiveIdentity from "./features/generateFictiveIdentity.js";
import randomPicture from "./features/randomPicture.js";
import verifyEmail from "./features/verifyEmail.js";
import checkCommonPassword from "./features/checkCommonPassword.js";
import domainInfo from "./features/domainInfo.js";
import crawlPerson from "./features/crawlPerson.js";
import ddosSimulation from "./features/ddosSimulation.js";

const publicRouter = express.Router();

/**
 * @swagger
 * /public/features:
 *   get:
 *     summary: Retrieve available public routes
 *     description: Returns a list of available public routes. Accessible to both users and admins.
 *     responses:
 *       200:
 *         description: A list of all available public routes
 */
publicRouter.get("/features", (req, res) => {
  const routes = `
    Available Routes for HackR API (Public, Accessible by Admin and User):

    1. GET /public/features/generate-secured-password
       Description: Generates a random secured password using crypto.

    2. GET /public/features/generate-fictive-identity
       Description: Generates a fake identity with name, email, phone, address, birthdate, and avatar using Faker.js.

    3. GET /public/features/random-picture
       Description: Fetches a random image URL from the 'thispersondoesnotexist.com' API.

    4. POST /public/features/verify-email
       Description: Verify the existence of an email address using Hunter.io API.

    5. POST /public/features/check-common-password
       Description: Verifies if a password is too common by checking it against a list of common passwords.

    6. POST /public/features/domain-info
       Description: Retrieves subdomains associated with a given domain using the SecurityTrails API.

    7. GET /public/features/crawl-person
       Description: Fetches information about a person based on their name and additional details using SerpAPI.

    8. POST /public/features/ddos-simulation
        Description: Initiates a DDoS simulation against the specified domain using worker threads.
  `;

  res.send(routes);
});

publicRouter.use("/", generateSecuredPassword);
publicRouter.use("/", generateFictiveIdentity);
publicRouter.use("/", randomPicture);
publicRouter.use("/", verifyEmail);
publicRouter.use("/", checkCommonPassword);
publicRouter.use("/", domainInfo);
publicRouter.use("/", crawlPerson);
publicRouter.use("/", ddosSimulation);

export default publicRouter;
