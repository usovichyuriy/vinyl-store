'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birthdate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
