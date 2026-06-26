'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_products_product_type" AS ENUM ('online', 'local');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)

    const tableInfo = await queryInterface.describeTable('products')

    if (!tableInfo.product_type) {
      await queryInterface.addColumn('products', 'product_type', {
        type: Sequelize.ENUM('online', 'local'),
        allowNull: false,
        defaultValue: 'local'
      })
    }
  },

  async down(queryInterface) {
    const tableInfo = await queryInterface.describeTable('products')

    if (tableInfo.product_type) {
      await queryInterface.removeColumn('products', 'product_type')
    }

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_products_product_type";')
  }
}
