import { defineConfig } from "prisma/config";
import { DATABASE_URL } from "./src/config/env";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL as string,
  },
});
