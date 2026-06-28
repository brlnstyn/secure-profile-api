const {body} = require('express-validator')

const registerValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Nama wajib diisi.')
        .isLength({min: 3, mac: 50})
        .withMessage('Nama harus terdiri dari 3-50 karakter.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Format email tidak valid.')
        .normalizeEmail(),
    body('password')
        .isString()
        .withMessage('Password harus berupa text.')
        .isLength({min: 8})
        .withMessage('Password minimal 8 karakter.')
        .matches(/[a-z]/)
        .withMessage('Password harus memiliki huruf kecil.')
        .matches(/[A-Z]/)
        .withMessage('Password harus memiliki huruf besar.')
        .matches(/[0-9]/)
        .withMessage('Password harus memiliki angka.')
];

const loginValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Format email tidak valid.')
        .normalizeEmail(),
    body('password')
        .isString()
        .notEmpty()
        .withMessage('Password wajib diisi.')
];

const changePasswordValidator = [
    body('oldPassword')
        .isString()
        .withMessage('Password harus berupa text.')
        .isLength({min: 8})
        .withMessage('Password minimal 8 karakter.')
        .matches(/[a-z]/)
        .withMessage('Password harus memiliki huruf kecil.')
        .matches(/[A-Z]/)
        .withMessage('Password harus memiliki huruf besar.')
        .matches(/[0-9]/)
        .withMessage('Password harus memiliki angka.'),
    body('newPassword')
        .isString()
        .withMessage('Password harus berupa text.')
        .isLength({min: 8})
        .withMessage('Password minimal 8 karakter.')
        .matches(/[a-z]/)
        .withMessage('Password harus memiliki huruf kecil.')
        .matches(/[A-Z]/)
        .withMessage('Password harus memiliki huruf besar.')
        .matches(/[0-9]/)
        .withMessage('Password harus memiliki angka.')
        .custom((value, { req }) => {
            if (value === req.body.oldPassword) {
                throw new Error('Password baru tidak boleh sama dengan password lama.');
            }
            return true;
        }),
];

module.exports = {registerValidator, loginValidator, changePasswordValidator};