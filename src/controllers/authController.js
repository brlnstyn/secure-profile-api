const bcrypt = require('bcryptjs')
const {randomUUID} = require('crypto');
const {validationResult} = require('express-validator')
// const users = require('../data/users')
const generateToken = require('../utils/generateToken');
const User = require("../models/User");

function validationErrorResponse(req, res) {
    const errors = validationResult(req);

    if (errors.isEmpty()) return null;

    return res.status(422).json({
        success: false,
        message: 'Data yang dikirim belum valid.',
        errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg
        })),
    });
}

function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
    }
}

async function register(req, res, next) {
    try {
        // const invalidResponse = validationErrorResponse(req, res);
        // if (invalidResponse) return invalidResponse;

        const name = req.body.name.trim();
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar. Gunakan email lain atau login.'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            email,
            password: passwordHash,
            role: 'user',
            createdAt: new Date().toISOString(),
        };

        const createdUser = await User.create(newUser);

        return res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: publicUser(createdUser),
            token: generateToken(createdUser),
        });
    } catch (error) {
        return next(error)
    }
}

async function login(req, res, next) {
    try {
        const invalidResponse = validationErrorResponse(req, res);
        if (invalidResponse) return invalidResponse;

        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        const user = await User.findByEmail(email);

        const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            data: publicUser(user),
            token: generateToken(user),
        });
    } catch (error) {
        return next(error);
    }
}

async function changePassword(req, res, next) {
    try {
        const invalidResponse = validationErrorResponse(req, res);
        if (invalidResponse) return invalidResponse;

        const email = req.body.email;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        const passwordMatches = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Password lama tidak sesuai.'
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save()

        return res.status(200).json({
            success: true,
            message: 'Password berhasil diubah.',
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {register, login, publicUser, changePassword};