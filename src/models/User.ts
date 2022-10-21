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
  }
}

export { User };
