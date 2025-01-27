'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const vinyls = [];
    for (let i = 1; i <= 50; i++) {
      vinyls.push({
        id: i,
        price: faker.commerce.price(),
        name: faker.lorem.words(2),
        authorName: faker.person.fullName(),
        description: faker.lorem.words(10),
        image: faker.image.avatar(),
      });
    }
    await queryInterface.bulkInsert('vinyls', vinyls);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vinyls', null, {});
  },
};
