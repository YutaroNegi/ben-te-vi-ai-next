import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // carrega o .env.test quando estiver em modo test
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [tsconfigPaths(), react()],
    test: {
      environment: "jsdom",
      env: loadEnv(mode, process.cwd(), ""),
    },
  };
});
