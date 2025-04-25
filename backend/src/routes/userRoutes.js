const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth');
const avatarUpload = require('../middleware/avatar-upload.middleware');

    router.get('/', userController.getAllUsers);

    router.post('/', avatarUpload ,userController.registerUser);

    router.post('/login', userController.loginUser);

    router.get('/search', userController.searchUserByName);

    router.get('/:id',verifyToken ,userController.getUserProfile);

    router.put('/:id',verifyToken, avatarUpload ,userController.updateUserProfile);

    router.delete('/:id', userController.deleteUser);

    router.post('/logout', userController.logoutUser);

    module.exports = router;

