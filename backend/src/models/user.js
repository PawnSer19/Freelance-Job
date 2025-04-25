const knex = require('../config/database');
const Joi = require('joi');

class User {
    constructor(){
        this.knex = knex;
    }

    userRepository(){
        return this.knex('users');
    }

    readUser(payload){
        return{
            name: payload.name,
            email: payload.email,
            password: payload.password,
            phone: payload.phone,
            city: payload.city,
            specialization: payload.specialization,
            education_level: payload.education_level,
            profile_updated_at: payload.profile_update,
            avatar: payload.avatar
        }
    }

    getUserValidationSchema(){
        return Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            phone: Joi.string().required(),
            city: Joi.string().required(),
            specialization: Joi.string(),
            education_level: Joi.string(),
            avatar: Joi.string().allow(null),
        });
    }

    async findByName(name) {
        return knex('users').where({ name }).first();
    }

    async findByEmail(email) {
        return knex('users').where({ email }).first();
    }

    async getAllUsers(page = 1, limit = 10){
        const offset = (page - 1) * limit;
        const users = await this.userRepository().select('*').limit(limit).offset(offset);
        const totalRecords = await this.userRepository().count('* as count').first();
        return {
            users,
            pagination: {
            totalRecords: totalRecords.count,
            totalPages: Math.ceil(totalRecords.count / limit),
            currentPage: page,
            perPage: limit,
            },
        };
    }

    async registerUser(payload){
        const {error} = this.getUserValidationSchema().validate(payload);
        if(error){
            throw new Error(error.details[0].message);
        }
        
        const user = await this.readUser(payload);
        const [id] = await this.userRepository().insert(user);
        return {id, ...user};
    }

    async getUserProfile(id){
        return this.userRepository().where('id', id).first();
    }

    async updateUserProfile(id, user, avatarPath = null){
        const users = await this.userRepository().where('id', id).select('*').first();
        if(!users){
            return null;
        }
        const updateUserProfile = await this.readUser(user);

        if (avatarPath) {
            updateUserProfile.avatar = avatarPath;
        }

        await this.userRepository().where('id', id).update(updateUserProfile);
        
        if (
            avatarPath &&
            users.avatar &&
            users.avatar !== avatarPath &&
            users.avatar.startsWith("/public/images")

        ) {
            unlink (`.${users.avatar}`, (err) => {})
        }

        
        
        return {...users, ...updateUserProfile}
    }

    async deleteUser(id) {
        const user = await this.userRepository().where('id', id).select('*').first();
        if(!user){
            return null;
        }
        return this.userRepository().where('id', id).del();
    }

    async searchByName(name) {
        return await this.userRepository()
            .where('name', 'like', `%${name}%`)
            .select('*');

        console.log('Generated Query:', query.toString());
        return await query;
    }

}

module.exports = User;