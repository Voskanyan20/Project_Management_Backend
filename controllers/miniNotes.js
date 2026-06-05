const database = require('../conf/db_config');

async function createMiniNote(req, res) {

    try {

        const {
            text,
            task_id,
        } = req.body;

        const task = await database.tasks.findByPk(task_id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        await database.miniNotes.create({
            text,
            task_id,
        });

        res.status(201).json({
            message: "Mini note created",
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message,
        });

    }

}

async function getTaskMiniNotes(req, res) {

    try {

        const { task_id } = req.params;

        const miniNotes = await database.miniNotes.findAll({

            where: {
                task_id,
            },

            order: [
                ['id', 'ASC']
            ],

        });

        res.status(200).json({
            miniNotes,
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message,
        });

    }

}

async function updateMiniNote(req, res) {

    try {

        const {
            text,
            is_completed,
        } = req.body;

        const miniNoteId = req.params.id;

        const miniNote = await database.miniNotes.findByPk(miniNoteId);

        if (!miniNote) {
            return res.status(404).json({
                message: "Mini note not found",
            });
        }

        await database.miniNotes.update(
            {
                text,
                is_completed,
            },
            {
                where: {
                    id: miniNoteId,
                },
            }
        );

        const allMiniNotes = await database.miniNotes.findAll({
            where: {
                task_id: miniNote.task_id,
            },
        });

        const allCompleted = allMiniNotes.every(
            item => item.is_completed === true
        );

        await database.tasks.update(
            {
                is_notes_completed: allCompleted,
            },
            {
                where: {
                    id: miniNote.task_id,
                },
            }
        );

        res.status(200).json({
            message: "Mini note updated",
            task_completed: allCompleted,
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message,
        });

    }

}

async function deleteMiniNote(req, res) {

    try {

        const id = req.params.id;

        const miniNote = await database.miniNotes.findByPk(id);

        if (!miniNote) {
            return res.status(404).json({
                message: "Mini note not found",
            });
        }

        await database.miniNotes.destroy({
            where: {
                id,
            },
        });

        const allMiniNotes = await database.miniNotes.findAll({
            where: {
                task_id: miniNote.task_id,
            },
        });

        const allCompleted =
            allMiniNotes.length > 0 &&
            allMiniNotes.every(item => item.is_notes_completed);

        await database.tasks.update(
            {
                is_completed: allCompleted,
            },
            {
                where: {
                    id: miniNote.task_id,
                },
            }
        );

        res.status(200).json({
            message: "Mini note deleted",
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message,
        });

    }

}


module.exports = {
    createMiniNote,
    getTaskMiniNotes,
    updateMiniNote,
    deleteMiniNote,
};