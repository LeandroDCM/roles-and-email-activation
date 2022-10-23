import express from "express";
import { routes } from "./routes";
//import "dotenv/config";
require("dotenv").config(); //changed because of tons of glitches

//get connections
require("./database");

const app = express();

app.use(express.json());
app.use(routes);

// Credentials
const port = process.env.SERVER_PORT;

try {
  app.listen(port);
  console.log(`Server is up and running on port ${port}`);
} catch (error) {
  console.log(error);
}
