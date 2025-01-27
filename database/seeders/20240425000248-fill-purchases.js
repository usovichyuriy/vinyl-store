'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const purchases = [];
    for (let i = 1; i <= 10; i++) {
      purchases.push({
        id: i,
        userId: faker.number.int({ min: 1, max: 10 }),
        vinylId: faker.number.int({ min: 1, max: 50 }),
        purchaseDate: faker.date.past(),
      });
    }
    await queryInterface.bulkInsert('purchases', purchases);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('purchases', null, {});
  },
};
