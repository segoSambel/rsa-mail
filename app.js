import path from "path";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { config as dotenvConfig } from "dotenv";
import router from "./routes/router.js";
import sequelize from "./config/database.js";
import cookieParser from "cookie-parser";

dotenvConfig();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

// Set the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set app routes
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Received Ctrl+C. Shutting down gracefully...");

  console.log("Server closed. Exiting process.");
  sequelize.close();
  process.exit(0);
});
