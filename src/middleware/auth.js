const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');



const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized, Token Expired.'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found'
            })
        }

        next();

    } catch (e) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }





}

module.exports = {
    protect
}