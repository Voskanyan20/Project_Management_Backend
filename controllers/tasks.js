const database = require('../conf/db_config')
const { Op } = require('sequelize')
const customOnError = require('./error')

// function getTasks(req, res) {
//     database.tasks
//         .findAll({
//             include: [
//                 database.user,
//                 database.status,
//                 database.priority,
//                 database.categories,
//             ]
//         })
//         .then((t) => res.json(t)).catch((e) => customError(req, res, e.name));
// }

async function getTasks(req, res) {

    try {

        const {
            user_id,
        } = req.body;

        const user = await database.user.findOne({
            where: {
                id: user_id,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        let tasks;

        // TeamLead can see all tasks
        if (user.Role === "TeamLead") {

            tasks = await database.tasks.findAll({
            include: [
                database.user,
                database.status,
                database.priority,
                database.categories,
            ]
        });

        }
        // Other users can see only their tasks
        else {

            tasks = await database.tasks.findAll({
            include: [
                database.user,
                database.status,
                database.priority,
                database.categories,
            ],
                where: {
                    user_id: user.id,
                },
            });

        }

        res.status(200).json({
            tasks: tasks,
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message,
        });

    }

}

async function createTasks(req, res) {
    try {

        const {
            title,
            description,
            comment,
            deadline,
            is_completed,
            user_id,
            status_id,
            priority_id,
            category_id
        } = req.body;

        await database.seq.transaction(async (transaction) => {

            await database.tasks.create(
                {
                    title,
                    description,
                    comment,
                    deadline,
                    is_completed,
                    user_id,
                    status_id,
                    priority_id,
                    category_id
                },
                {
                    transaction: transaction,
                }
            );

            res.status(201).json({
                message: "Task created",
            });

        });

    } catch (e) {
        console.log(e);

        res.status(500).json({
            message: e.message,
        });
    }
}

async function updateTasks(req, res) {

    const {
        title,
        description,
        comment,
        deadline,
        is_completed,
        user_id,
        status_id,
        priority_id,
        category_id
    } = req.body;

    const tasksId = req.params.id;

    try {

        await database.seq.transaction(async (transaction) => {

            const task = await database.tasks.findByPk(tasksId);

            if (!task) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            await database.tasks.update(
                {
                    title,
                    description,
                    comment,
                    deadline,
                    is_completed,
                    user_id,
                    status_id,
                    priority_id,
                    category_id,
                    updated_at: new Date()
                },
                {
                    where: {
                        id: tasksId
                    },
                    transaction: transaction
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

function deleteTasks(req, res) {
    const id = req.params.id;
    database.tasks.destroy({
        where: { id }
    }).then(() => {
        res.json(" Task deleted! ")
    }).catch((e) => {
        res.status(500).json({
            message: e.message
        });
    })
}

module.exports = {
  getTasks,
  createTasks,
  deleteTasks,
  updateTasks
}