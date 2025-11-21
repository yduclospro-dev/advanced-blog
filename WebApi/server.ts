import { PrismaClient } from "@prisma/client";
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
app.use(helmet());

const allowedOrigins = process.env.NODE_ENV === "production"
  ? [process.env.CORS_ORIGIN || "https://advanced-blog-4j0k.onrender.com"]
  : ["http://localhost:3000"];
  
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const prisma = new PrismaClient();


app.get('/', (req, res) => {
  res.send('<h1>Bienvenue sur l\'API Advanced Blog 🚀</h1><p>Consultez la documentation ou utilisez /api pour accéder aux endpoints.</p>');
});

app.get('/healthz', async (req, res) => {
  const start = Date.now();
  try {
    await prisma.user.count();
    const duration = Date.now() - start;
    res.status(200).json({ status: 'ok', db: 'ok', durationMs: duration });
  } catch (e) {
    const duration = Date.now() - start;
    res.status(503).json({ status: 'error', db: 'unreachable', durationMs: duration });
  }
});

app.use("/api", apiRouter);

app.use(errorHandler);

if (!process.env.JEST_WORKER_ID) {
  app.listen(port, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Server ready and listening (production mode) on port ${port}`);
    } else {
      console.log(`Server ready on http://localhost:${port}`);
    }
  });
} else {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.status(404).send('Not Found in test env');
  });
}