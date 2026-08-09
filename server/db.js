require("dotenv").config();

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri);

let database;

async function connectDB() {
  try {
    await client.connect();

    database = client.db("chatgpt_clone");

    console.log("✅ MongoDB Connected");

    return database;
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    throw error;
  }
}

function getDB() {
  if (!database) {
    throw new Error("Database is not connected");
  }

  return database;
}

module.exports = {
  connectDB,
  getDB,
};