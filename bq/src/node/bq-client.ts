import { BigQuery } from "@google-cloud/bigquery";
import { util } from "@google-cloud/common";
import bqJson from "@google-cloud/bigquery/package.json" assert { type: "json" };
export const createBQClient = () => {
  const options = {
    projectId: "dc_sql",
    apiEndpoint: "http://0.0.0.0:9050",
    baseUrl: "http://0.0.0.0:9050",
    scopes: ["https://www.googleapis.com/auth/bigquery"],
    packageJson: bqJson,
    customEndpoint: true,
  };

  const bigQueryClient = new BigQuery(options);

  // Hack: connecting to a local Datastore server
  // @see https://blog.open.tokyo.jp/2022/12/18/bigquery-test-on-node-js.html
  // bigQueryClient.makeAuthenticatedRequest = util.makeAuthenticatedRequestFactory(options);

  return bigQueryClient;
};
