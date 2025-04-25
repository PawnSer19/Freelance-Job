const knex = require('../config/database');
const Joi = require('joi');

class Application {
    constructor(){
        this.knex = knex;
    }

    applicationRepository(){
        return this.knex('applications');
    }

    readApplication(payload, job_id, freelancer_id){
        return {
            job_id,
            freelancer_id,
            application_date: payload.application_date || new Date(),
            status: payload.status || 'pending'
        };
    }

    getApplicationValidationSchema(){
        return Joi.object({
            job_id: Joi.string().required(),
            freelancer_id: Joi.string(),
            application_date: Joi.date(),
            status: Joi.string()
        });
    }

    async createApplication(payload, job_id, freelancer_id) {
        if (!freelancer_id) {
            throw new Error("Freelancer ID is required.");
        }

        const existingApplication = await this.applicationRepository()
            .where({ job_id, freelancer_id })
            .first();

        if (existingApplication) {
             throw new Error("Application already exists for this job and freelancer.");
        }

        const { error } = this.getApplicationValidationSchema().validate(payload);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const applicationData = {
            job_id: job_id,
            freelancer_id: freelancer_id,
            application_date: payload.application_date,
            status: payload.status
        };

        const [id] = await this.applicationRepository().insert(applicationData);

        return { status: 'success', id, ...applicationData };
}

    
    async getApplication(id) {
        return this.applicationRepository().where('id', id).first();
    }

    async getApplicationByJobId(jobId) {
        if(!jobId) {
            throw new Error('job Id is required');
        }
        return this.applicationRepository()
        .from('applications as a')
        .join('users as u', 'a.freelancer_id', '=', 'u.id') 
        .select('a.id', 'a.job_id', 'a.application_date', 'a.status', 'a.freelancer_id' ,'u.name', 'u.email', 'u.phone') 
        .where('a.job_id', jobId);
    }

    async getApplicationByFreelancerId(freelancer_id) {
        return this.applicationRepository().where('freelancer_id', freelancer_id).select('*');
    }

    async updateApplication( application_id, status){
        console.log(application_id, status);
        return this.applicationRepository().where('id', application_id).update({ status });
    }

    async deleteApplication(id){
        const application = await this.applicationRepository().where('id', id).select('*').first();
        if(!application){
            return false;
        }
        const deleteCount = await this.applicationRepository().where('id', id).del();

        return deleteCount > 0;
    }
}

module.exports = Application;
