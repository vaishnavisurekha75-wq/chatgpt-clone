require("dotenv").config();

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let database;

async function connectDB() {
  try {
    await client.connect();
    database = client.db("chatgpt_clone");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Error:", error.message);
  }
}

function getDB() {
  return database;
}

module.exports = {
  connectDB,
  getDB,
};