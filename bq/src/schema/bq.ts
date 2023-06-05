import * as z from "zod";

// @see https://cloud.google.com/bigquery/docs/schemas?hl=ja#creating_a_json_schema_file

const typeSchema = z.enum([
  "STRING",
  "BYITES",
  "INTEGER",
  "INT64",
  "FLOAT",
  "FLOAT64",
  "BOOLEAN",
  "TIMESTAMP",
  "DATE",
  "TIME",
  "DATETIME",
  "GEOGRAPHY",
  "NUMERIC",
  "BIGNUMERIC",
  "JSON",
  "RECORD",
  "STRUCT",
]);

const modeSchema = z.enum(["NULLABLE", "REQUIRED", "REPEATED"]);

const columnSchema = z.object({
  name: z.string(),
  type: typeSchema,
  mode: modeSchema.optional(),
  description: z.string().optional(),
  fields: z.array(z.record(z.any())).optional(),
});

export const columnsSchema = z.array(columnSchema);

const tableSchema = z.object({
  id: z.string(),
  columns: z.array(columnSchema),
  data: z.array(z.any()),
});

export type Table = z.infer<typeof tableSchema>;

const datasetSchema = z.object({
  id: z.string(),
  tables: z.array(tableSchema),
});

const projectSchema = z.object({ id: z.string(), datasets: z.array(datasetSchema) });

const projectsSchema = z.array(projectSchema);
