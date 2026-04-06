const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const { createJob, getAllJobs, updateJob, deleteJob, applyToJob, getJobApplications} = require('../controllers/jobController');

router.post('/', authMiddleware, createJob);
router.get('/', getAllJobs);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);
router.post('/:id/apply', authMiddleware, applyToJob);
router.get('/:id/applications', authMiddleware, getJobApplications);
module.exports = router;