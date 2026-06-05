module.exports = (seq, Sequelize) => {
  const userRole = seq.define('userRole', {
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
    }
  }, {
    tableName: "userRole",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
})
  return userRole;
}