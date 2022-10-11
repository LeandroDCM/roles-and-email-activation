const { Model, DataTypes } = require('sequelize');

class Tech extends Model {
  static init(sequelize: any) {
    super.init({
      name: DataTypes.STRING,
    }, {
      sequelize,
      tableName: 'techs',
    })
  }

  static associate(models: any) {
    this.belongsToMany(models.User, { foreignKey: 'tech_id', through: 'user_techs', as: 'users' });
  }
}

export { Tech }