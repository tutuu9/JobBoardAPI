const Job = require('../models/Job');
const Application = require('../models/Application');
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
const getAllJobs = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;

        const search = req.query.search || "";
        const sort = req.query.sort;
        const location = req.query.location;
        const minSalary = parseInt(req.query.minSalary);
        const maxSalary = parseInt(req.query.maxSalary);

        let sortOption = { createdAt: -1 };

        if (sort === "asc" || sort === "old") {
            sortOption = { createdAt: 1 };
        } else if (sort === "title") {
            sortOption = { title: 1 };
        }

        let filter = {};

        // 🔍 search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // 📍 location
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        // 💰 salary
        if (minSalary || maxSalary) {
            filter.salary = {};

            if (minSalary) {
                filter.salary.$gte = minSalary;
            }

            if (maxSalary) {
                filter.salary.$lte = maxSalary;
            }
        }

        if (page < 1) page = 1;
        if (limit < 1) limit = 5;
        if (limit > 20) limit = 20;

        const total = await Job.countDocuments(filter);
        const pages = Math.ceil(total / limit);

        if (page > pages && pages !== 0) {
            page = pages;
        }

        const skip = (page - 1) * limit;

        const jobs = await Job.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('company', 'name email');

        return res.status(200).json({
            status: 'success',
            search,
            page,
            limit,
            total,
            pages,
            jobs
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};
const updateJob = async (req, res) => {
    try{
        const id = req.params.id;
        let job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                status: 'error',
                message: 'Job not found'
            });
        }
        if (job.company.toString() !== req.user._id.toString()){
            return res.status(403).json({
                status: 'error',
                message: 'User doesn\'t have permission to update jobs'
            })
        }
        const { title, description, salary, location } = req.body;

        if (!title || !description || !salary || !location) {
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }
        job = await Job.findByIdAndUpdate(
            id,
            {
                title,
                description,
                salary,
                location,
                company: req.user._id
            },
            {
                new: true,
                runValidators: true
            }
        );
        return res.status(200).json({
            status: 'success',
            message: 'Job update successfully',
            job
        });

    } catch (error){
        return res.status(500).json({
            status: 'error',
            message: error.message
        })
    }

}
const deleteJob = async (req, res) => {
    try {
        const id = req.params.id;
        let job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                status: 'error',
                message: 'Job not found'
            });
        }
        if (job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: "User doesn't have permission to delete jobs"
            });
        }
        await Job.findByIdAndDelete(id);
        return res.status(200).json({
            status: 'success',
            message: 'Job deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
const applyToJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        const message = req.body.message;
        if (req.user.role !== 'user') {
            return res.status(403).json({
                status: 'error',
                message: 'Only users can apply to jobs'
            })
        }
        if (!job) {
            return res.status(404).json({
                status: 'error',
                message: 'Job not found'
            })
        }
        const existingApplication = await Application.findOne({
            user: req.user._id,
            job: req.params.id
        });
        if (existingApplication) {
            return res.status(400).json({
                status: 'error',
                message: 'User already applied'
            })
        }
        await Application.create({
            user: req.user._id,
            job: job._id,
            message: message,
        })
        return res.status(201).json({
            status: 'success',
            message: 'Application created successfully'
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}
const getJobApplications = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                status: 'error',
                message: 'Job not found'
            })
        }
        if (job.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                status: 'error',
                message: 'User doesn\'t have permission'
            })
        }
        const applications = await Application.find({job: jobId}).populate('user', 'name lastName email').sort({createdAt: -1});
        return res.status(200).json({
            status: 'success',
            job: job,
            count: applications.length,
            applications: applications
        })
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: err.message
        })
    }
}
module.exports = {
    createJob,
    getAllJobs,
    deleteJob,
    updateJob,
    applyToJob,
    getJobApplications,
};