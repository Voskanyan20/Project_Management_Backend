const database = require('../conf/db_config')
const customOnError = require('./error')
const { normalizeOptions } = require('../utils/categoryOptions')
const { validateParentCategory } = require('../utils/categoryHierarchy')

const categoryInclude = [
  {
    model: database.categories,
    as: 'parent',
    attributes: ['id', 'name'],
  },
  {
    model: database.categories,
    as: 'subcategories',
    attributes: ['id', 'name', 'options', 'parent_id', 'created_at'],
  },
]

function getCategories(req, res) {
    database.categories
        .findAll({
            include: categoryInclude,
            order: [
                ['name', 'ASC'],
                [{ model: database.categories, as: 'subcategories' }, 'name', 'ASC'],
            ],
        })
        .then((t) => res.json(t)).catch((e) => customOnError(req, res, e.name));
}

async function createCategories(req, res) {
    try {
        const { name, options, parent_id } = req.body;

        const parentValidation = await validateParentCategory(parent_id)
        if (!parentValidation.valid) {
            return res.status(400).json({ message: parentValidation.message })
        }

        await database.seq.transaction(async (transaction) => {

            await database.categories.create(
                {
                    name,
                    options: normalizeOptions(options),
                    parent_id: parentValidation.parent_id,
                },
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

    const { name, options, parent_id } = req.body;

    const categoryId = req.params.id;

    try {

        const parentValidation = await validateParentCategory(parent_id, categoryId)
        if (!parentValidation.valid) {
            return res.status(400).json({ message: parentValidation.message })
        }

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
                    options: normalizeOptions(options),
                    parent_id: parentValidation.parent_id,
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

async function deleteCategories(req, res) {
    const id = req.params.id;

    try {
        const subcategoryCount = await database.categories.count({
            where: { parent_id: id },
        })

        if (subcategoryCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete category with subcategories',
            })
        }

        const productCount = await database.products.count({
            where: { category_id: id },
        })

        if (productCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete category used by products',
            })
        }

        await database.categories.destroy({ where: { id } })
        res.json(" categories deleted! ")
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

module.exports = {
  getCategories,
  deleteCategories,
  createCategories,
  updateCategories
}
