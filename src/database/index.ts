const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

import { User } from "../models/User";

const connection = new Sequelize(dbConfig);

User.init(connection);

//User.associate(connection.models);

export { connection };
