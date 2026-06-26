module.exports = (seq, Sequelize) => {
  const products = seq.define('products', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    },
    cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    stock_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    minimum_stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    product_type: {
      type: Sequelize.ENUM('online', 'local'),
      allowNull: false,
      defaultValue: 'local'
    }
  })
  return products;
}