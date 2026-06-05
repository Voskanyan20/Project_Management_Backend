module.exports = (seq, Sequelize) => {
  const priority = seq.define('priority', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    level: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    }
  }, {
    tableName: "priority",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
})
  return priority
}