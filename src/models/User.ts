const { Model, DataTypes } = require("sequelize");
class User extends Model {
  static init(sequelize: any) {
    super.init(
      {
        username: {
          type: DataTypes.STRING,
          unique: true,
        },
        name: DataTypes.STRING,
        email: {
          type: DataTypes.STRING,
          unique: true,
        },
        password: DataTypes.STRING,
        role_id: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
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
