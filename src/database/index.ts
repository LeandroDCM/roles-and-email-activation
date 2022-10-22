const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

import { User } from "../models/User";
import { Post } from "../models/Post";

const connection = new Sequelize(dbConfig);

User.init(connection);
Post.init(connection);

//make connection between models(association)
//user_id = null error if this is not here
User.associate(connection.models);
Post.associate(connection.models);

export { connection };
