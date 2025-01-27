'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [];
    const values = ['user', 'admin'];
    for (let i = 1; i <= 10; i++) {
      roles.push({
        userId: i,
        value: 'user',
      });
    }
    await queryInterface.bulkInsert('roles', roles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
