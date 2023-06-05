import { env } from "./env";

export type GlobalOptions = { api: string; project_id: string };

const { DEFAULT_API, DEFAULT_PROJECT_ID } = env;

export const DEFAULT_GLOBAL_OPTIONS = {
  api: DEFAULT_API,
  project_id: DEFAULT_PROJECT_ID,
} as const satisfies Partial<GlobalOptions>;
