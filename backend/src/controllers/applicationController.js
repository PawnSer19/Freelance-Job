const Application = require('../models/application');
const jsend = require('../jsend');
const Job = require('../models/job');
const { application } = require('express');
const { deleteJob } = require('./jobController');

const applyModel = new Application;
const jobModel = new Job;

module.exports = {
applyJob: async (req, res) => {
    const payload = req.body;

    const job_id = payload.job_id;

    const freelancer_id = req.user.id;

    try {
        const apply = await applyModel.createApplication(payload, job_id ,freelancer_id);
        return res.json(jsend.success({ apply: apply }));
    } catch (error) {
        console.error(error);
        return res.status(400).json(jsend.fail({ message: error.message }));
    }
    
},

getApplicationsByJob: async (req, res) => {
    const { id: jobId } = req.params;
    const applications = await applyModel.getApplicationByJobId(jobId);
    return res.json(jsend.success({ applications }));
},

getApplicationsByFreelancer: async (req, res) => {
    const freelancer_id = req.user.id;
    const applications = await applyModel.getApplicationByFreelancerId(freelancer_id);
    return res.json(jsend.success({ applications }));
},

updateApplication: async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;
    const updatedApplication = await applyModel.updateApplication(applicationId, status);

    if (updatedApplication) {
        return res.json(jsend.success({ message: 'Application status updated successfully' }));
    } else {
        return res.status(404).json(jsend.fail({ message: 'Application not found' }));
    }
},


deleteApplication: async (req, res) => {
    const {id} = req.params;
    try {
        const result = await applyModel.deleteApplication(id);

        if (result) {
            return res.status(200).json(jsend.success({ message: 'Application Deleted' }));
        } else {
            return res.status(404).json(jsend.fail({ message: 'Application not found' }));
        }
    } catch (error) {
        console.error('Error deleting application:', error);
        return res.status(500).json(jsend.error('Internal server error'));
    }
}
}