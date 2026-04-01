const express = require('express');
const router = express.Router();

const { registerUser } = require('../controllers/authController');
const authRoutes = require('./routes/authRoutes');

router.post('/register', registerUser);
app.use('/api/auth', authRoutes);
module.exports = router;