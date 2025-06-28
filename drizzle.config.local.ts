import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations-local",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "./local.db",
  },
});
