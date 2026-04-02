const Job = require('../models/Job');

const createJob = async (req, res) => {
    try {
        const { title, description, salary, location } = req.body;

        if (!title || !description || !salary || !location) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        if (req.user.role !== 'company') {
            return res.status(403).json({
                status: 'error',
                message: "User doesn't have permission to create jobs"
            });
        }

        const job = await Job.create({
            title,
            description,
            salary,
            location,
            company: req.user._id
        });

        return res.status(201).json({
            status: 'success',
            message: 'Job created successfully',
            job
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    createJob
};