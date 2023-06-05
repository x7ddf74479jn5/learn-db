export const Logger = {
  log: (...entry: any[]) => console.log("[bq-node]", ...entry),
  success: (...entry: any[]) => console.log("[bq-node]", ...entry),
  error: (...entry: any[]) => console.log("[bq-node]", ...entry),
  info: (...entry: any[]) => console.log("[bq-node]", ...entry),
  debug: (...entry: any[]) => console.log("[bq-node:debug]", ...entry),
};
