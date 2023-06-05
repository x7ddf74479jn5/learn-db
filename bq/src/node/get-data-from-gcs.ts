import { Storage } from "@google-cloud/storage";

async function run() {
  // [START storage_list_buckets]
  // Imports the Google Cloud client library
  // const { Storage } = require("@google-cloud/storage");

  // Creates a client
  const storage = new Storage({
    apiEndpoint: "http://localhost:4443",
    projectId: "test",
  });

  // Lists all buckets in the current project
  const [buckets] = await storage.getBuckets();
  console.log("Buckets:");
  buckets.forEach((bucket) => {
    console.log(bucket.id);
  });
  // [END storage_list_buckets]

  const [content] = await storage.bucket("example-bucket").file("example.txt").download();
  console.log("Contents:");
  console.log(content.toString());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
