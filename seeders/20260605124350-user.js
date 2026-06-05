'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        id: 100000,
        name: "Karen",
        email: "karen@mail.ru",
        Role: "Admin",
        password: "Karen123",
        created_at: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op
    return await queryInterface.bulkDelete(
      'user',
      {
        id: {
          [Op.in]: [100000]
        }
      },
      {}
    )
  }
}