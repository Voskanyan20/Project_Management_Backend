const database = require('../conf/db_config')
const { Op } = require('sequelize')
const customOnError = require('./error')

function getUser(req, res) {
    database.user
        .findAll({})
        .then((t) => res.json(t)).catch((e) => customError(req, res, e.name));
}

async function signIn(req, res) {
    try {

        const {
            email,
            password,
        } = req.body;

        await database.seq.transaction(async (transaction) => {

            const user = await database.user.findOne(
                {
                    where: {
                        email: email,
                    },
                    transaction: transaction,
                }
            );

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            if (user.password !== password) {
                return res.status(401).json({
                    message: "Invalid password",
                });
            }

            res.status(200).json({
                message: "Signin successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    Role: user.Role,
                },
            });

        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: e.message,
        });

    }
}

module.exports = {
  getUser,
  signIn
}
