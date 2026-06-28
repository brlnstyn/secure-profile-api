const express = require('express');
const {protect, requireRole} = require('../middleware/auth');
const {getMe, getAllUsers, countAllUsers} = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.get('/me', getMe);
router.get('/', requireRole('admin'), getAllUsers);
router.get('/count', requireRole('admin'), countAllUsers);

module.exports = router;