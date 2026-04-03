const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { createJob, getAllJobs } = require('../controllers/jobController');

router.post('/', authMiddleware, createJob);
router.post('/', getAllJobs);
module.exports = router;