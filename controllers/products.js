const database = require('../conf/db_config')
const { Op } = require('sequelize')
const customOnError = require('./error')

function getProducts(req, res) {
    database.products
        .findAll({
            include: [
                database.categories,
            ]
        })
        .then((t) => res.json(t)).catch((e) => customError(req, res, e.name));
}

async function createProducts(req, res) {
    try {
        const {
            name,
            description,
            cost_price,
            price,
            stock_quantity,
            minimum_stock,
            category_id
        } = req.body;

        await database.seq.transaction(async (transaction) => {

            await database.products.create(
                {
                    name,
                    description,
                    cost_price,
                    price,
                    stock_quantity,
                    minimum_stock,
                    category_id
                },
                {
                    transaction: transaction,
                }
            );

            res.status(201).json({
                message: "Product created",
            });

        });

    } catch (e) {
        console.log(e);

        res.status(500).json({
            message: e.message,
        });
    }
}

async function updateProducts(req, res) {

    const {
        name,
        description,
        cost_price,
        price,
        stock_quantity,
        minimum_stock,
        category_id
    } = req.body;

    const productsId = req.params.id;

    try {

        await database.seq.transaction(async (transaction) => {

            const product = await database.products.findByPk(productsId);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            await database.products.update(
                {
                    name,
                    description,
                    cost_price,
                    price,
                    stock_quantity,
                    minimum_stock,
                    category_id,
                    updated_at: new Date()
                },
                {
                    where: {
                        id: productsId
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

function deleteProducts(req, res) {
    const id = req.params.id;
    database.products.destroy({
        where: { id }
    }).then(() => {
        res.json(" Product deleted! ")
    }).catch((e) => {
        res.status(500).json({
            message: e.message
        });
    })
}

async function getRestockProducts(req, res) {

    const products = await database.products.findAll();

    res.json(
        products.filter(
            p => p.stock_quantity <= p.minimum_stock
        )
    );

}

module.exports = {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
  getRestockProducts
}