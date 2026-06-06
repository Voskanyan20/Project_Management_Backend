const database = require('../conf/db_config');
const customError = require('./error');

function getOrderItems(req, res) {
    database.orderItems
        .findAll({
            include: [
                database.orders,
                database.products
            ]
        })
        .then((t) => res.json(t))
        .catch((e) => customError(req, res, e.name));
}

async function createOrderItems(req, res) {

    try {

        const {
            order_id,
            product_id,
            quantity,
            unit_price
        } = req.body;

        if (!order_id || !product_id || !quantity || unit_price == null) {
            return res.status(400).json({
                message: "order_id, product_id, quantity, and unit_price are required"
            });
        }

        await database.seq.transaction(async (transaction) => {

            const order = await database.orders.findByPk(order_id, { transaction });

            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            const product = await database.products.findByPk(product_id, { transaction });

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.stock_quantity < quantity) {
                return res.status(400).json({
                    message: "Not enough stock available"
                });
            }

            await database.orderItems.create(
                {
                    order_id,
                    product_id,
                    quantity,
                    unit_price
                },
                {
                    transaction
                }
            );

            await database.products.decrement(
                {
                    stock_quantity: quantity
                },
                {
                    where: {
                        id: product_id
                    },
                    transaction
                }
            );

            res.status(201).json({
                message: "Order item created"
            });

        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message
        });

    }
}

async function updateOrderItems(req, res) {

    const itemId = req.params.id;

    const {
        quantity,
        unit_price
    } = req.body;

    try {

        await database.seq.transaction(async (transaction) => {

            const item = await database.orderItems.findByPk(itemId);

            if (!item) {
                return res.status(404).json({
                    message: "Order item not found"
                });
            }

            await database.orderItems.update(
                {
                    quantity,
                    unit_price
                },
                {
                    where: {
                        id: itemId
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

function deleteOrderItems(req, res) {

    const id = req.params.id;

    database.orderItems.destroy({
        where: {
            id
        }
    })
    .then(() => {
        res.json("Order item deleted!");
    })
    .catch((e) => {
        res.status(500).json({
            message: e.message
        });
    });

}

module.exports = {
    getOrderItems,
    createOrderItems,
    updateOrderItems,
    deleteOrderItems
};