import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import authRouter from "./routes/authRouter.js";
import publicRouter from "./routes/public/publicRouter.js";
import privateRouter from "./routes/private/privateRouter.js";
import createDefaultAdmin from "./utils/createDefaultAdmin.js";
import verifyToken from "./middleware/verifyToken.js";
import verifyAdmin from "./middleware/verifyAdmin.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//  Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HackR API",
      version: "1.0.0",
      description: "API documentation for the HackR API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        jwtAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        jwtAuth: [],
      },
    ],
  },
  apis: ["./routes/**/*.js"],
};

// Mongo
const mongoDB = process.env.MONGO_URI;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoDB);
    console.log("🟢 Connected to MongoDB successfully");

    createDefaultAdmin();
  } catch (error) {
    console.error("🔴 Error connecting to MongoDB: ", error);
  }
};

connectToMongoDB();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Public routes
app.get("/", (req, res) => {
  const routes = `
    <h1>Welcome to HackR API!</h1>
    <p>Here is an overview of the available routes:</p>

    <h2>Public Routes (Accessible by Admin and User):</h2>
    <ul>
      <li><strong>GET /public/features</strong><br>Description: Lists all available public routes.</li>
      <li><strong>GET /public/features/generate-secured-password</strong><br>Description: Generates a random secured password using crypto.</li>
      <li><strong>GET /public/features/generate-fictive-identity</strong><br>Description: Generates a fake identity with name, email, phone, address, birthdate, and avatar using Faker.js.</li>
      <li><strong>GET /public/features/random-picture</strong><br>Description: Fetches a random image URL from 'thispersondoesnotexist.com' API.</li>
      <li><strong>POST /public/features/verify-email</strong><br>Description: Verifies the existence of an email address using the Hunter.io API.</li>
      <li><strong>POST /public/features/check-common-password</strong><br>Description: Verifies if a password is too common by checking it against a list of common passwords.</li>
      <li><strong>POST /public/features/domain-info</strong><br>Description: Retrieves subdomains associated with a given domain using the SecurityTrails API.</li>
      <li><strong>GET /public/features/crawl-person</strong><br>Description: Fetches information about a person based on their name and additional details using SerpAPI.</li>
      <li><strong>POST /public/features/ddos-simulation</strong><br>Description: Initiates a DDoS simulation against the specified domain using worker threads.</li>
    </ul>

    <h2>Private Routes (Accessible only by Admin):</h2>
    <ul>
      <li><strong>GET /private/home</strong><br>Description: "Hello, you are an Admin!."</li>
      <li><strong>POST /private/features/email-spammer</strong><br>Description: Sends a certain number of emails to a given address with the provided content.</li>
      </ul>
  `;

  res.send(routes);
});

app.use("/auth", authRouter);

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Public routes (Admin & Users)
app.use("/public", verifyToken, publicRouter);

// Private routes (Admin)
app.use("/private", verifyToken, verifyAdmin, privateRouter);

// Start server
app.listen(port, () => {
  console.log(`🟢 Server is running on port ${port}`);
  console.log(`📄 Swagger Docs available at http://localhost:${port}/api-docs`);
});
