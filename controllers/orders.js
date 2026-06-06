const database = require('../conf/db_config');
const customError = require('./error');

function getOrders(req, res) {
    database.orders
        .findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: database.orderItems,
                    include: [
                        database.products
                    ]
                }
            ]
        })
        .then((t) => res.json(t))
        .catch((e) => customError(req, res, e.name));
}

async function createOrders(req, res) {

    try {

        const {
            total_amount,
            status
        } = req.body;

        await database.seq.transaction(async (transaction) => {

            const order = await database.orders.create(
                {
                    total_amount,
                    status
                },
                {
                    transaction
                }
            );

            res.status(201).json({
                message: "Order created",
                order: {
                    id: order.id,
                    total_amount: order.total_amount,
                    status: order.status,
                    createdAt: order.createdAt,
                }
            });

        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message
        });

    }
}

async function updateOrders(req, res) {

    const orderId = req.params.id;

    const {
        total_amount,
        status
    } = req.body;

    try {

        await database.seq.transaction(async (transaction) => {

            const order = await database.orders.findByPk(orderId);

            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            await database.orders.update(
                {
                    total_amount,
                    status
                },
                {
                    where: {
                        id: orderId
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

async function deleteOrders(req, res) {

    const id = req.params.id;

    try {

        await database.seq.transaction(async (transaction) => {

            const items = await database.orderItems.findAll({
                where: { order_id: id },
                transaction
            });

            for (const item of items) {
                if (item.product_id) {
                    await database.products.increment(
                        { stock_quantity: item.quantity },
                        {
                            where: { id: item.product_id },
                            transaction
                        }
                    );
                }
            }

            await database.orderItems.destroy({
                where: { order_id: id },
                transaction
            });

            const deleted = await database.orders.destroy({
                where: { id },
                transaction
            });

            if (!deleted) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            res.json({ message: "Order deleted!" });

        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message
        });

    }

}

module.exports = {
    getOrders,
    createOrders,
    updateOrders,
    deleteOrders
};