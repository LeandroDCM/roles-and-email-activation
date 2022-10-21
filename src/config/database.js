module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'Leandro',
  password: '12345',
  database: 'sequelize_tut',
  define: {
    timestamps: true, //created_at, updated_at
    underscored: true,
  },
};