module.exports = (seq, Sequelize) => {
  const orderItems = seq.define('order_items', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    unit_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  });

  return orderItems;
};