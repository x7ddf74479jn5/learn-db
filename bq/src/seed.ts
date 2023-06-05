import path from "node:path";
import fs from "node:fs";

import { parse } from "csv-parse";
import { dump } from "js-yaml";

import { columnsSchema, Table } from "./schema/bq.js";
import * as modelSchema from "./schema/model.js";
import { env } from "./utils/env.js";

const { DEFAULT_DATASET_ID, DEFAULT_PROJECT_ID, DATASETS_DIR_PATH, DB_CONFIG_DIR_PATH } = env;

const log = (...entry: any[]) => console.log("[bq:seed:debug]", ...entry);

export async function seedCore(debug?: boolean) {
  const models = fs
    .readdirSync(DATASETS_DIR_PATH)
    .filter((f) => path.extname(f) === ".csv")
    .map((f) => path.basename(f).split(".")[0]);

  if (debug) {
    log("models", models);
  }

  if (models.length === 0) {
    console.error(`[bq] Dataset not found in ${DATASETS_DIR_PATH}`);
    process.exit(1);
  }

  const tables = await Promise.all(
    models.map(async (model) => {
      try {
        const csvPath = path.join(DATASETS_DIR_PATH, `${model}.csv`);
        const schemaJsonPath = path.join(DATASETS_DIR_PATH, `${model}.json`);

        const data = await parseCSV(csvPath);

        if (debug) {
          log("parsedCSV", data);
        }

        let modelName = model;

        // snake to camel
        if (model.includes("_")) {
          const [first, ...rest] = modelName.split("_");
          modelName = [first, rest.map(([f, ...r]) => f.toUpperCase().concat(...r))].join("");
        }

        // @ts-ignore
        const modelSchemaParser = modelSchema[`${modelName}Schema`].parse;
        const parsedData = modelSchemaParser(data);

        const columns = columnsSchema.parse(JSON.parse(fs.readFileSync(schemaJsonPath, "utf-8")));

        const table = {
          id: model,
          columns,
          data: debug ? parsedData.slice(0, 3) : parsedData,
        };

        if (debug) {
          log("table", table);
        }

        return table;
      } catch (e) {
        console.error("[bq] CSV parse Error", e);
        process.exit(1);
      }
    })
  );

  const dumpResult = dumpYAML(tables);

  if (debug) {
    log("dumpResult", dumpResult);
  }

  const to = `${DB_CONFIG_DIR_PATH}/data.yaml`;

  fs.writeFileSync(to, dumpResult, "utf-8");

  console.info(`[bq] Succeed to dump data to ${to}`);
}

const parseCSV = async (srcPath: string, limit?: number) => {
  const records = [];
  const parser = fs.createReadStream(srcPath).pipe(
    parse({
      columns: true,
      cast: true,
      bom: true,
    })
  );

  let index = 0;
  for await (const record of parser) {
    records.push(record);
    index++;
    if (limit === index) break;
  }

  return records;
};

const dumpYAML = (tables: Table[]) => {
  const result = dump({
    projects: [
      {
        id: DEFAULT_PROJECT_ID,
        datasets: [
          {
            id: DEFAULT_DATASET_ID,
            tables: tables,
          },
        ],
      },
    ],
  });

  return result;
};
