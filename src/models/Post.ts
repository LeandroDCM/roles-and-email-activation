const { Model, DataTypes } = require("sequelize");

class Post extends Model {
  static init(sequelize: any) {
    super.init(
      {
        post: DataTypes.STRING,
        name: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }
  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export { Post };
