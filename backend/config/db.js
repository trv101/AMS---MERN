import { Sequelize } from "sequelize";

import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    logging: false,
  }
);

db.sync() // Use force: true only for development, as it drops existing tables
  .then(() => {
    console.log("Tables synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing tables:", err);
  });

export default db;
