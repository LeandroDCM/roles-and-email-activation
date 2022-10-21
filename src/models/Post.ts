const { Model, DataTypes } = require("sequelize");

class Post extends Model {
  static init(sequelize: any) {
    super.init(
      {
        zipcode: DataTypes.STRING,
        street: DataTypes.STRING,
        number: DataTypes.INTEGER,
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
