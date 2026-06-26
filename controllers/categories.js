const database = require('../conf/db_config')
const { Op } = require('sequelize')
const customOnError = require('./error')

function getCategories(req, res) {
    database.categories
        .findAll({})
        .then((t) => res.json(t)).catch((e) => customOnError(req, res, e.name));
}

async function createCategories(req, res) {
    try {
        const { name } = req.body;

        await database.seq.transaction(async (transaction) => {

            await database.categories.create(
                { name },
                {
                    transaction: transaction,
                }
            );

            res.status(201).json({
                message: "Category created",
            });

        });

    } catch (e) {
        console.log(e);

        res.status(500).json({
            message: e.message,
        });
    }
}

async function updateCategories(req, res) {

    const { name } = req.body;

    const categoryId = req.params.id;

    try {

        await database.seq.transaction(async (transaction) => {

            const category = await database.categories.findByPk(categoryId);

            if (!category) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            await database.categories.update(
                {
                    name,
                    updated_at: new Date()
                },
                {
                    where: {
                        id: categoryId
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

function deleteCategories(req, res) {
    const id = req.params.id;
    database.categories.destroy({
        where: { id }
    }).then(() => {
        res.json(" categories deleted! ")
    }).catch((e) => {
        res.status(500).json({
            message: e.message
        });
    })
}

module.exports = {
  getCategories,
  deleteCategories,
  createCategories,
  updateCategories
}