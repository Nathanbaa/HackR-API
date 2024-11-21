import express from "express";
import { faker } from "@faker-js/faker";

const router = express.Router();

/**
 * @swagger
 * /public/features/generate-fictive-identity:
 *   get:
 *     summary: Generate a fictive identity
 *     description: Generates a fake identity with name, email, phone, address, birthdate, and avatar using Faker.js.
 *     responses:
 *       200:
 *         description: A fictive identity is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 identity:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                         city:
 *                           type: string
 *                         country:
 *                           type: string
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                     avatar:
 *                       type: string
 */
router.get("/features/generate-fictive-identity", (req, res) => {
  const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: "age" });
  const formattedBirthDate = birthDate.toISOString().split("T")[0];

  const fakeIdentity = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
    },
    birthdate: formattedBirthDate,
    avatar: faker.image.avatar(),
  };

  res.status(200).json({ identity: fakeIdentity });
});

export default router;
