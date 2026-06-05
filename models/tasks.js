module.exports = (seq, Sequelize) => {
  const tasks = seq.define('tasks', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    },
    deadline: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    is_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    is_notes_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
  })
  return tasks
}