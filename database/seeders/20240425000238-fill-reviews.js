'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const reviews = [];
    for (let i = 1; i <= 15; i++) {
      reviews.push({
        id: i,
        userId: faker.number.int({ min: 1, max: 10 }),
        vinylId: faker.number.int({ min: 1, max: 50 }),
        description: faker.lorem.words(10),
        reviewDate: faker.date.past(),
        rating: faker.number.int({ min: 0, max: 10 }),
      });
    }
    await queryInterface.bulkInsert('reviews', reviews);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reviews', null, {});
  },
};
