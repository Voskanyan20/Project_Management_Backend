module.exports = (seq, Sequelize) => {
  const status = seq.define('status', {
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
    tableName: "status",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
})
  return status
}