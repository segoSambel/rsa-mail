import { Sequelize } from "sequelize";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync();
    console.log("Models synced with the database");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
