const { MongoClient } = require("mongodb");

let clientPromise = null;

function getClientPromise() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI tanımlı değil.");
  }
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
}

async function getDb() {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || "limos");
}

module.exports = { getDb };
