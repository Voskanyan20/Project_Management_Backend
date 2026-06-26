module.exports = (seq, Sequelize) => {
  const categories = seq.define('categories', {
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
    options: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    },
    parent_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: "categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
})
  return categories
}