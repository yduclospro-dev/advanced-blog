import { config } from "dotenv";
import { defineConfig } from "@prisma/config";

config({ path: process.env.DOTENV_CONFIG_PATH || ".env" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://test:test@localhost:5432/testdb",
  }
});