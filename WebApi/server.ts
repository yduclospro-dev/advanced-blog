import express from "express";
import next from "next";
import apiRouter from "./routes/apiRouter.ts";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const port = Number(process.env.PORT || 3000);

nextApp.prepare().then(() => {
  const app = express();
  app.use(express.json());

  app.use("/api", apiRouter);

  app.use((req, res) => handle(req, res));

  app.listen(port, () => {
    console.log(`Server ready on http://localhost:${port}`);
  });
});