const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const {getMyApplications} = require('../controllers/applicationController');

router.get('/my', authMiddleware, getMyApplications);
module.exports = router;