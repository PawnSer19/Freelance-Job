const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const jsend = require('../jsend');
const bcrypt = require('bcrypt');
const path = require('path');

const userModel = new UserModel


module.exports = {

getAllUsers: async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    try {
        const result = await userModel.getAllUsers(page, limit);
        return res.json(jsend.success({ result }));
    } catch (err) {
        res.json(jsend.fail({ message: 'Error'}))
    }
},

registerUser: async (req, res) => {
    const { name, email, password, phone, city } = req.body;


    const userAvatar = req.file ? path.join('/public/images', req.file.filename) : null ;
    const existingName = await userModel.findByName(name);
    if (existingName) {
        return res.status(400).json(jsend.fail({ message: 'Name already exist' }));
    }

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
        return res.status(400).json(jsend.fail({ message: 'Email already exist' }));
    }

    const hashsedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.registerUser({name, email, password: hashsedPassword, phone, city ,avatar: userAvatar});
    return res.json(jsend.success({ newUser }));
},

loginUser: async (req, res) => {
    const { email, password } = req.body;
    
    const user = await userModel.findByEmail(email);
    if (!user) {
        return res.status(400).json(jsend.error({ message: 'Email or Password is incorrect' }));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json(jsend.error({ message: 'Email or Password is incorrect' }));
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '2h'
    });

    const userProfile = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        specialization: user.specialization,
        education_level: user.education_level
    };
    return res.json(jsend.success({ message: 'Login Successful', token, userProfile, user: { id: user.id}}));
},

getUserProfile: async (req, res) => {
    const {id} = req.params;
    const userProfile = await userModel.getUserProfile(id);
    if ( !userProfile ) {
        return res.status(404).json(jsend.fail({
                message: 'User not found'
        }));
    }
    return res.json(jsend.success({ userProfile: userProfile }));
},

updateUserProfile: async (req, res) => {
    const {id} = req.params;
    const userAvatar = req.file ? path.join('/public/images', req.file.filename) : null ;
    const user = await userModel.updateUserProfile(id, req.body, userAvatar);

    if (!user) {
        return res.status(404).json(jsend.error({ message: 'User not found' }));
    }
    
    return res.json(jsend.success({ user: user }));
},

deleteUser: async (req, res) => {
    const {id} = req.params;
    await userModel.deleteUser(id);
    return res.json(jsend.success({ message: 'User deleted'}));
},

logoutUser: async (req, res) => {
    return res.json({
        status: 'success',
        message: 'Logout'
    })
},

searchUserByName: async (req, res) => {
    const { name } = req.query;
    console.log('Search Name:', name);
   try {
    const users = await userModel.searchByName(name); 
    res.json({ status: 'success', data: { users: users } });
  } catch (error) {
    console.error('Error searching users by name:', error);
    res.status(500).json({ status: 'error', message: 'Failed to search users' });
  }
}

}