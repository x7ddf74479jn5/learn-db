import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const env = createEnv({
  server: {
    DEFAULT_API: z.string().url(),
    DEFAULT_PROJECT_ID: z.string().min(1),
    DEFAULT_DATASET_ID: z.string().min(1),
    DATASETS_DIR_PATH: z.string().min(1),
    DB_CONFIG_DIR_PATH: z.string().min(1),
  },
  runtimeEnv: process.env,
});
