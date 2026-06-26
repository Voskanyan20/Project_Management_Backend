const database = require('../conf/db_config')
const customOnError = require('./error')
const {
    validateOptionValues,
    normalizeOptions,
} = require('../utils/categoryOptions')

function normalizeProductType(value) {
    if (value === 'online') return 'online'
    return 'local'
}

async function resolveProductPricing(category, optionValues, fallbackPrice, fallbackCostPrice) {
    const categoryOptions = normalizeOptions(category?.options)

    if (categoryOptions.length === 0) {
        return {
            optionValues: {},
            price: fallbackPrice,
            cost_price: fallbackCostPrice,
        }
    }

    const validation = validateOptionValues(category.options, optionValues)
    if (!validation.valid) {
        const error = new Error(validation.message)
        error.statusCode = 400
        throw error
    }

    return {
        optionValues: validation.optionValues,
        price: fallbackPrice,
        cost_price: fallbackCostPrice,
    }
}

function getProducts(req, res) {
    database.products
        .findAll({
            include: [
                {
                    model: database.categories,
                    include: [
                        {
                            model: database.categories,
                            as: 'parent',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
            ]
        })
        .then((t) => res.json(t)).catch((e) => customOnError(req, res, e.name));
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
            category_id,
            product_type,
            option_values,
        } = req.body;

        await database.seq.transaction(async (transaction) => {
            const category = await database.categories.findByPk(category_id, { transaction })

            if (!category) {
                return res.status(400).json({
                    message: 'Category not found',
                })
            }

            const resolved = await resolveProductPricing(
                category,
                option_values,
                price,
                cost_price
            )

            await database.products.create(
                {
                    name,
                    description,
                    cost_price: resolved.cost_price,
                    price: resolved.price,
                    stock_quantity,
                    minimum_stock,
                    category_id,
                    product_type: normalizeProductType(product_type),
                    option_values: resolved.optionValues,
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

        res.status(e.statusCode || 500).json({
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
        category_id,
        product_type,
        option_values,
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

            const effectiveCategoryId = category_id ?? product.category_id
            const category = await database.categories.findByPk(effectiveCategoryId, { transaction })

            if (!category) {
                return res.status(400).json({
                    message: 'Category not found',
                })
            }

            const resolved = await resolveProductPricing(
                category,
                option_values ?? product.option_values,
                price ?? product.price,
                cost_price ?? product.cost_price
            )

            await database.products.update(
                {
                    name,
                    description,
                    cost_price: resolved.cost_price,
                    price: resolved.price,
                    stock_quantity,
                    minimum_stock,
                    category_id: effectiveCategoryId,
                    product_type: normalizeProductType(product_type),
                    option_values: resolved.optionValues,
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

        res.status(e.statusCode || 500).json({
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

    const products = await database.products.findAll({
            include: [
                {
                    model: database.categories,
                    include: [
                        {
                            model: database.categories,
                            as: 'parent',
                            attributes: ['id', 'name'],
                        },
                    ],
                },
            ]
        });

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
