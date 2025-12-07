import dotenv from "dotenv";

console.log("DOTENV_CONFIG_PATH =", process.env.DOTENV_CONFIG_PATH);

dotenv.config({
  path: process.env.DOTENV_CONFIG_PATH || ".env"
});

console.log("DATABASE_URL =", process.env.DATABASE_URL);
