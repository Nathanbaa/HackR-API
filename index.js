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

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware global
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
        url: "http://localhost:3000", // URL de base de l'API
      },
    ],
  },
  apis: ["./routes/**/*.js"], // Indique où Swagger doit chercher les annotations
};

// Mongo
const mongoDB = process.env.MONGO_URI;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
    });
    console.log("🟢 Connected to MongoDB successfully");

    createDefaultAdmin();
  } catch (error) {
    console.error("🔴 Error connecting to MongoDB: ", error);
  }
};

connectToMongoDB();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Routes publiques
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Welcome to HackR API");
});
app.use("/auth", authRouter);
app.use("/public", publicRouter);

// Routes privées
app.use("/private", privateRouter);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🟢 Server is running on port ${port}`);
  console.log(`📄 Swagger Docs available at http://localhost:${port}/api-docs`);
});
