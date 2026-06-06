const database = require('../conf/db_config');
const customError = require('./error');

function getNotes(req, res) {
    database.notes
        .findAll()
        .then((t) => res.json(t))
        .catch((e) => customError(req, res, e.name));
}

async function createNotes(req, res) {
    try {

        const {
            title,
            description,
            deadline,
            is_completed
        } = req.body;

        await database.seq.transaction(async (transaction) => {

            await database.notes.create(
                {
                    title,
                    description,
                    deadline,
                    is_completed
                },
                {
                    transaction
                }
            );

            res.status(201).json({
                message: "Note created"
            });

        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message
        });

    }
}

async function updateNotes(req, res) {

    const noteId = req.params.id;

    const {
        title,
        description,
        deadline,
        is_completed
    } = req.body;

    try {

        await database.seq.transaction(async (transaction) => {

            const note = await database.notes.findByPk(noteId);

            if (!note) {
                return res.status(404).json({
                    message: "Note not found"
                });
            }

            await database.notes.update(
                {
                    title,
                    description,
                    deadline,
                    is_completed
                },
                {
                    where: {
                        id: noteId
                    },
                    transaction
                }
            );

            res.status(200).json({
                message: "updated"
            });

        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message
        });

    }
}

function deleteNotes(req, res) {

    const id = req.params.id;

    database.notes.destroy({
        where: {
            id
        }
    })
    .then(() => {
        res.json("Note deleted!");
    })
    .catch((e) => {
        res.status(500).json({
            message: e.message
        });
    });

}

module.exports = {
    getNotes,
    createNotes,
    updateNotes,
    deleteNotes
};