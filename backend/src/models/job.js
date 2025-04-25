const knex = require('../config/database');
const Joi = require('joi');

class Job {
    constructor(){
        this.knex = knex;
    }

    jobRepository(){
        return this.knex('jobs');
    }

    readJob(payload, employer_id){
        return{
            employer_id,
            title: payload.title,
            description: payload.description,
            required_skills: payload.required_skills,
            salary_range: payload.salary_range,
            deadline: payload.deadline,
            created_at: payload.created_at
        }
    }

    getJobValidationSchema(){
        return Joi.object({
            employer_id: Joi.number(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            required_skills: Joi.string().required(),
            salary_range: Joi.string().required(),
            deadline: Joi.date().required()
        })
    }

    async createJob(payload, employer_id) {
        const {error} = this.getJobValidationSchema().validate(payload);
        if(error){
            throw new Error(error.details[0].message);
        }
        const job = await this.readJob(payload, employer_id) ;
        const [id] = await this.jobRepository().insert(job);
        return{id, ...job};
    }

    async getAllJobs(limit, offset) {
        const totalRecordsResult = await this.jobRepository().count('id as count').first();
        const totalRecords = totalRecordsResult.count;

        const jobs = await this.jobRepository()
            .select('id','employer_id','title','required_skills','salary_range','deadline','created_at')
            .limit(limit)
            .offset(offset);
        return {
            totalRecords,
            jobs
        };
    }

    async findJobByIdEmployer(employerId) {
        return this.jobRepository().where('employer_id', employerId).select('*');
    }

    async getJobByID(id) {
        return this.jobRepository().where('id', id).first();
    }

    async updateJob(id, job){
        const jobs = await this.jobRepository().where('id', id).select('*').first();
        if(!jobs){
            return null;
        }
        const updateJob = await this.readJob(job);
        await this.jobRepository().where('id', id).update(updateJob);
        return {...jobs, ...updateJob}
    }

    async deleteJob(id){
        const job = await this.jobRepository().where('id', id).select('*').first();
        if(!job){
            return null;
        }
        return this.jobRepository().where('id', id).del();
    }

    async searchByTitle(title) {
        return this.jobRepository().where('title', 'like', `%${title}%`).select('*');  
    }

}

module.exports = Job;