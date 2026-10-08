/* routes/adminRoutes.js — dashboard routes (require x-admin-key) */
const express = require('express');
const admin = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/summary', admin.getSummary);
router.get('/users', admin.listUsers);
router.get('/users/:id', admin.getUser);
router.delete('/users/:id', admin.deleteUser);
router.get('/attempts', admin.listAttempts);
router.get('/questions', admin.questionStats);
router.get('/export/:dataset', admin.exportCSV);

module.exports = router;
