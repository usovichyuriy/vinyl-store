'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

      logDate: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      level: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      modelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('logs');
  },
};
