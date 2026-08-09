require("dotenv").config();

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
  } catch (error) {
    console.log("❌ MongoDB Error:", error.message);
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