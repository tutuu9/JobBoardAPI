const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { createJob } = require('../controllers/jobController');

router.post('/', authMiddleware, createJob);

module.exports = router;