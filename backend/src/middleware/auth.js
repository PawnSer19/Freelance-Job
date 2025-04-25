const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const jsend = require('../jsend');

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json(jsend.fail({ message: 'Please Login' }));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Decode user: ', req.user);
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json(jsend.fail({ message: 'Token Expired. Login again.'}));
        }
        else {
            return res.status(400).json(jsend.fail({ message: 'Token not accept' }));
        }
    }
};


module.exports = verifyToken;