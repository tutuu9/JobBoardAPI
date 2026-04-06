const Application = require('../models/Application');
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user._id })
            .populate('job')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: 'success',
            applications
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
module.exports = {
    getMyApplications
};