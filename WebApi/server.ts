import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRouter from "@webapi/routes/apiRouter.ts";
import cookieParser from 'cookie-parser';
import { errorHandler } from "@webapi/middleware/errorHandler.ts";

const port = Number(process.env.PORT || 3000);

export const app = express();

app.use(express.json());
app.use(cookieParser());

// Sécurité de base
app.use(helmet());

// CORS dynamique : autorise localhost en dev, domaine en prod
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [process.env.CORS_ORIGIN || "https://advanced-blog-4j0k.onrender.com"]
  : ["http://localhost:3000"];
  
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use("/api", apiRouter);

app.use(errorHandler);

if (!process.env.JEST_WORKER_ID) {
  app.listen(port, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Server ready and listening (production mode) on port ${port}`);
    } else {
      console.log(`Server ready on http://localhost:${port}/api`);
    }
  });
} else {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.status(404).send('Not Found in test env');
  });
}