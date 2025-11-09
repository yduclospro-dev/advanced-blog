
import express from "express";
import next from "next";
import cors from "cors";
import apiRouter from "./routes/apiRouter.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = Number(process.env.PORT || 3000);

// Create and export the express app synchronously so tests can import it.
export const app = express();
app.use(express.json());

// Autorise les requêtes du front (localhost:3000)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/api", apiRouter);

app.use(errorHandler);

// If running tests under Jest, skip preparing Next to avoid side-effects and noisy logs.
if (!process.env.JEST_WORKER_ID) {
  // When Next is ready, attach its handler and start listening (production/dev run)
  nextApp.prepare().then(() => {
    app.use((req, res) => handle(req, res));

    app.listen(port, () => {
      console.log(`Server ready on http://localhost:${port}`);
    });
  }).catch(err => {
    console.error('Failed to prepare Next app', err);
  });
} else {
  // In test environment, attach a minimal handler to avoid 404 from Next when tests hit non-API routes.
  app.use((req, res, next) => {
    // If request starts with /api, let router handle it. Otherwise return 404.
    if (req.path.startsWith('/api')) return next();
    res.status(404).send('Not Found in test env');
  });
}