//had to add this to fix crazy glitch
require("dotenv").config();

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: "localhost",
  dialect: "postgres",
  define: {
    timestamps: true, //created_at, updated_at
    underscored: true,
  },
};
