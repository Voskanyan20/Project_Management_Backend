module.exports = (seq, Sequelize) => {
  const orders = seq.define('orders', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: Sequelize.ENUM(
        'Pending',
        'Completed',
        'Cancelled'
      ),
      defaultValue: 'Pending'
    }
  });

  return orders;
};