'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({
        id: i,
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthdate: faker.date.birthdate(),
        avatar: faker.image.avatar(),
      });
    }
    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
