module.exports = (seq, Sequelize) => {

    const notes = seq.define('notes', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        is_completed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },

    });

    return notes;

}