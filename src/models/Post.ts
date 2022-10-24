const { Model, DataTypes } = require("sequelize");

class Post extends Model {
  static init(sequelize: any) {
    super.init(
      {
        post: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }
  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "owner" });
  }
}

export { Post };
