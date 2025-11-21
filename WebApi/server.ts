import express from "express";
import cors from "cors";
import apiRouter from "@webapi/routes/apiRouter.ts";
import cookieParser from 'cookie-parser';
import { errorHandler } from "@webapi/middleware/errorHandler.ts";

const port = Number(process.env.PORT || 3000);

export const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/api", apiRouter);

app.use(errorHandler);

if (!process.env.JEST_WORKER_ID) {
  app.listen(port, () => {
    console.log(`Server ready on http://localhost:${port}`);
  });
} else {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.status(404).send('Not Found in test env');
  });
}