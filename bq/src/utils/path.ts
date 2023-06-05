import path from "node:path";

const CWD = process.cwd();
const DB_CONFIG_DIR_PATH = `${CWD}/db`;
const DATASETS_DIR_PATH = `${DB_CONFIG_DIR_PATH}/"datasets"`;
const SQL_DIR_PATH = `${CWD}/"SQL"`;

export { CWD, DB_CONFIG_DIR_PATH, DATASETS_DIR_PATH, SQL_DIR_PATH };
