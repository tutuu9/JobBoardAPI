const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { createJob, getAllJobs, updateJob, deleteJob } = require('../controllers/jobController');

router.post('/', authMiddleware, createJob);
router.post('/', getAllJobs);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);
module.exports = router;