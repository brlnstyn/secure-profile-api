// const users = require('../data/users')
const {publicUser} = require("./authController");
const User = require("../models/User");

async function getMe(req, res) {
    const existingUser = await User.findByEmail(req.user.email);

    return res.status(200).json({
        success: true,
        data: publicUser(existingUser),
    });
}

async function getAllUsers(req, res, next) {
    try {
        const data = await User.find({}, 'id name email createdAt');
        return res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        next(error);
    }
}

async function countAllUsers(req, res, next) {
    try {
        const total = await User.countDocuments();
        return res.status(200).json({
            success: true,
            data: total,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {getMe, getAllUsers, countAllUsers};
