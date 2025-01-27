'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('roles');
  },
};
