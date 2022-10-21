module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, //created_at, updated_at
    underscored: true,
  },
};
