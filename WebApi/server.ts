
import express from "express";
import next from "next";
import cors from "cors";
import apiRouter from "./routes/apiRouter.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = Number(process.env.PORT || 3000);

nextApp.prepare().then(() => {
  const app = express();
  app.use(express.json());

  // Autorise les requêtes du front (localhost:3000)
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));

  app.use("/api", apiRouter);

  app.use(errorHandler);

  app.use((req, res) => handle(req, res));

  app.listen(port, () => {
    console.log(`Server ready on http://localhost:${port}`);
  });
});