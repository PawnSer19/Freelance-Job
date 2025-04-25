const Job = require('../models/job');
const jsend = require('../jsend');

const jobModel = new Job;

module.exports = {
    getAllJobs: async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10;

        const offset = (page - 1) * limit;

        try {
            const { totalRecords, jobs} = await jobModel.getAllJobs(parseInt(limit), parseInt(offset));
            const totalPages = Math.ceil(totalRecords / limit);

            return res.json(jsend.success({ 
                jobs,
                pagination: {
                    totalRecords,
                    totalPages,
                    currentPage: parseInt(page),
                    perPage: parseInt(limit)
                }
             }));
        } catch (error) {
            console.error('Error Fetching Jobs:', error);
            return res.status(500).json(jsend.error('Error Fetching Jobs'));
        }
    },
    createJob: async (req, res) => {
        const payload = req.body;

        const employer_id = req.user.id;
        console.log(employer_id);

        const job = await jobModel.createJob(payload, employer_id );
        return res.json(jsend.success({ job: job }));
    },

    findJobByIdEmployer: async (req, res) => {
        const employerId = req.user.id;

        const job = await jobModel.findJobByIdEmployer(employerId);
        return res.json(jsend.success({ job }));
    },

    findJobById: async (req, res) => {
        const {id} = req.params;
        const job = await jobModel.getJobByID(id);

        if (!job) {
        return res.status(404).json(jsend.fail({ message: 'Không tìm thấy công việc' }));
    }
        return res.json(jsend.success({ job: job }));
    },

    updateJob: async (req, res) => {
        const {id} = req.params;
        const job = await jobModel.updateJob(id, req.body);
        return res.json(jsend.success({ job }));
    },

    deleteJob: async (req, res) => {
        const {id} = req.params;
        await jobModel.deleteJob(id);
        return res.json(jsend.success({message: 'Job Deleted'}));
    },

    searchJobsByTitle: async (req, res) => {
        const { title } = req.query;
        try {
            const jobs = await jobModel.searchByTitle(title);
            return res.json(jsend.success({ jobs }));
        } catch (error) {
            console.error('error searching:', error);
            return res.status(500).json(jsend.error('Error searching'));
        }
    }

}