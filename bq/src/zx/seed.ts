import { seedCore } from "../seed.js";
import { Logger } from "./logger.js";

export async function seed(debug?: boolean) {
  await seedCore(debug).catch((e) => {
    Logger.error("Unhandled error", e);
    process.exit(1);
  });
}
