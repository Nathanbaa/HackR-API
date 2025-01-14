import Log from "../models/log.js";

const logFeatureUsage = async (req, res, next) => {
  const excludedRoutes = [
    "auth/login",
    "auth/register",
    "auth/logout",
    "/",
    "/private/home",
    "/public/features",
  ];

  if (excludedRoutes.includes(req.originalUrl)) {
    return next();
  }

  if (req.originalUrl.startsWith("/private/logs")) {
    return next();
  }

  const startTime = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - startTime;

    const logData = {
      userId: req.user?.id || null,
      userFirstName: req.user?.firstName || "Anonymous",
      userEmail: req.user?.email || "unknown@example.com",
      url: req.originalUrl,
      success: res.statusCode >= 200 && res.statusCode < 300,
      errorMessage: res.locals.errorMessage || null,
      duration,
    };

    try {
      const log = new Log(logData);
      await log.save();

      console.log("Log enregistré:", log);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du log:", error);
    }
  });

  next();
};

export default logFeatureUsage;
