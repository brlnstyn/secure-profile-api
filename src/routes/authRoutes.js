const express = require('express')
const {register, login, changePassword} = require('../controllers/authController')
const {registerValidator, loginValidator, changePasswordValidator} = require('../validators/authValidator')

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/changePassword', changePasswordValidator, changePassword);

module.exports = router;