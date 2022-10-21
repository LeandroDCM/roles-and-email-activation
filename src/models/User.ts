const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize: any) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }
  static associate(models: any) {
    this.hasMany(models.Post, { foreignKey: "user_id", as: "posts" });
    this.belongsToMany(models.Tech, {
      foreignKey: "user_id",
      through: "user_techs",
      as: "techs",
    });
  }
}

export { User };
