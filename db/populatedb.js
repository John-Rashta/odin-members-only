#! /usr/bin/env node

const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR (50),
  second_name VARCHAR (50),
  username VARCHAR (255),
  password TEXT,
  membership_status BOOLEAN,
  admin BOOLEAN
);

CREATE TABLE IF NOT EXISTS message_authors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  message_id INTEGER REFERENCES messages (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR (255),
  time_stamp TIMESTAMP,
  message_text TEXT
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    host: "localhost", // or wherever the db is hosted
    user: process.env.ROLE_NAME,
    database: "club_data",
    password: process.env.ROLE_PASSWORD,
    port: 5432 // The default port
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();