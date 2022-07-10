const express = require('express');

const userRoutes = require('./user.route');
const attendanceRoutes = require('./attendance.route');
const authRoutes = require('./auth.route');

const router = express.Router();

/**
 * GET api/v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET api/v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/', authRoutes);

router.use('/users', userRoutes);
router.use('/attendance', attendanceRoutes);

module.exports = router;
