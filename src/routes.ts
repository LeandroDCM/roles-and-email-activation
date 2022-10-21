const express = require("express");
const routes = express.Router();

//Controllers
import UserController from "./controllers/UserController";

// Public Routes
routes.get("/", (req: any, res: any) => {
  return res.json({ hello: "world" });
});

// Register User Route
routes.post("/auth/register", UserController.register);

// Login User Route
routes.post("/auth/login", UserController.login);

export { routes };
