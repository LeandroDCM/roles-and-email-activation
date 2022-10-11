'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('techs', 'name', {
          type: Sequelize.STRING,
          allowNull: false,
      },
  )},

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('techs', 'name', {
          type: Sequelize.INTEGER,
          allowNull: false,
      },
  )}
};
