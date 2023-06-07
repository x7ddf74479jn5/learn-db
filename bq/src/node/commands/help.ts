export const help = () => {
  console.log(helpText);
};

export const helpText = `CLI for interacting with BigQuery Emulator.


USAGE: bq-node <command> [--command_flags][args]


Any of the following commands:
  help, query, query-table, seed



help                       Help for all commands.

seed                       Seed.

query                      Execute a query.
                           --input, -i: SQL file path
                           args: SQL file path

query-table                Execute a query for table stats.
                           --dataset, -d: dataset id
                           --input, -i: table id
                           args: table id

load-csv                   Load csv file to BigQuery Emulator.
                           --dataset, -d: dataset id
                           --input, -i: table id
                           --src, -s: CSV file paths
                           args: CSV file paths
                           
`;
