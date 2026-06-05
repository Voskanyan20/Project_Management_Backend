module.exports = (seq, Sequelize) => {

    const miniNotes = seq.define('mini_notes', {

        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        text: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        is_completed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },

    });

    return miniNotes;

}