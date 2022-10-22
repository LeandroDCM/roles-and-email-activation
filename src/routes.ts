import express from "express";
import checkToken from "./middleware/checkToken";
const routes = express.Router();

//Controllers
import UserController from "./controllers/UserController";
import EmailController from "./controllers/EmailController";
import PostController from "./controllers/PostController";

// Public Routes ------------------------------------------
routes.get("/", (req: any, res: any) => {
  return res.json({ hello: "world" });
});

// Register User Route
routes.post("/auth/register", UserController.register);

// Login User Route
routes.post("/auth/login", UserController.login);

// Recover User Route
routes.put("/auth/recover", EmailController.recover);

// Reset Password
routes.patch("/auth/reset/:token", UserController.reset);

//Private Route -------------------------------------------
//function checkToken to check if token is authorized to access private route
routes.get("/user/", checkToken, UserController.userIndex);

// get/update/delete post route
//routes.get("/posts/", checkToken, PostController.index);
//routes.get("/posts/:id", checkToken, PostController.userPosts);
routes.post("/user/post", checkToken, PostController.makePost);
routes.patch("/user/:postid", checkToken, PostController.updatePost);
//routes.delete("/user/:postid", checkToken, PostController.delete);
export { routes };
