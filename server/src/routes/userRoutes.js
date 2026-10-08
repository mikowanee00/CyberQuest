/* routes/userRoutes.js — public account routes (no login needed) */
const express = require('express');
const { register, login } = require('../controllers/userController');

const router = express.Router();

router.post('/', register);       // POST /api/users
router.post('/login', login);     // POST /api/users/login

module.exports = router;
