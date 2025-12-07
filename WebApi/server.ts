import { prisma } from "@infra/prismaClient";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRouter from "@webapi/routes/apiRouter";
import cookieParser from 'cookie-parser';
import { errorHandler } from "@webapi/middleware/errorHandler";
import { createCompositionRoot } from "@root/compositionRoot";

const port = Number(process.env.PORT || 3000);

export function createApp() {
  const services = createCompositionRoot();
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());

  const allowedOrigins = process.env.NODE_ENV === "production"
    ? [process.env.CORS_ORIGIN || "https://advanced-blog-4j0k.onrender.com"]
    : ["http://localhost:3000"];

  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));

  app.get('/', (req, res) => res.send('OK ROOT'));

  app.get('/healthz', async (req, res) => {
    try {
      await prisma.user.count();
      res.send("OK");
    } catch {}
  });

  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}

if (!process.env.JEST_WORKER_ID) {
  const app = createApp();
  app.listen(port, () => {
    console.log(`Server ready on http://localhost:${port}`);
  });
}