# BigQuery study

## Books

- [集中演習 SQL入門 Google BigQueryではじめるビジネスデータ分析（できるDigital Camp） \- インプレスブックス](https://book.impress.co.jp/books/1119101189)

## Tools

- [goccy/bigquery\-emulator: BigQuery emulator server implemented in Go](https://github.com/goccy/bigquery-emulator)

## Usage

```sh
pnpm build
docker compose up -d
pnpm bq-zx seed

// bq-node: CLI for interacting with BigQuery Emulator.
// bq-zx: Wrapped CLI of 'bq' for interacting with BigQuery Emulator.
```
