"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.removeColumn("posts", "name", {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("posts", "name", {});
  },
};
