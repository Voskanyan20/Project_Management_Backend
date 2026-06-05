module.exports = (seq, Sequelize) => {
  const user = seq.define('user', {
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
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    },
    Role: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    },
  }, {
    tableName: "user",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
})
  return user
}