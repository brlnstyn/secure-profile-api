const users = require('../data/users')
const {publicUser} = require("./authController");

function getMe(req, res) {
    const existingUser = users.find((user) => user.email === req.user.email);

    return res.status(200).json({
        success: true,
        data: publicUser(existingUser),
    });
}

function getAllUsers(req, res) {
    const data = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    }));
    return res.status(200).json({
        success: true,
        data: data,
    });
}

function countAllUsers(req, res) {
    const total = users.length
    return res.status(200).json({
        success: true,
        data: total
    });
}

module.exports = {getMe, getAllUsers, countAllUsers};
