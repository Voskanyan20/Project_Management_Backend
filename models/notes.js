module.exports = (seq, Sequelize) => {
    const notes = seq.define('notes', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },

        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        description: {
            type: Sequelize.STRING,
            allowNull: true
        },

        deadline: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },

        is_completed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return notes;
}