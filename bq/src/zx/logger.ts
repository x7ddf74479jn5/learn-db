import { chalk } from "zx";

export const Logger = {
  log: (...entry: any[]) => console.log(chalk.bgGray("[bq-zx]"), ...entry),
  success: (...entry: any[]) => console.log(chalk.bgGreen("[bq-zx]"), ...entry),
  error: (...entry: any[]) => console.log(chalk.bgRed("[bq-zx]"), ...entry),
  info: (...entry: any[]) => console.log(chalk.bgBlue("[bq-zx]"), ...entry),
  debug: (...entry: any[]) => console.log(chalk.bgBlue("[bq-zx:debug]"), ...entry),
};
