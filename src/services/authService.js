const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { refreshToken } = require('../controllers/authController');

const generateToken = async(userId) => {
    return jwt.sign({
        id: userId
    }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE })

}

const generateRefreshToken = async(userId) => {
    return jwt.sign({
        id: userId
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    })
}

const refreshAccessToken = async(oldToken)=>{
if(!oldToken){
    throw new Error('Refresh Token Required.')
}

const decoded = jwt.verify(
    oldToken,
    process.env.JWT_SECRET
)
const user = await User.findById(decoded.id).select('+refreshToken')
if(user.refreshToken !== oldToken ){
    throw new Error('Token reuse detected')
}

const newRefreshToken = await generateRefreshToken(user._id);

user.refreshToken = newRefreshToken;
await user.save()


return {
    accessToken: await generateToken(user._id),
    refreshToken:newRefreshToken
}

}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return null;
    }
}

const registerUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
        throw new Error('Email already registered');
    }

    const user = await User.create(userData);
    const token = generateToken(user._id)
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
        },
        token
    }

}

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await user.comparePassword(password)) {

        throw new Error('Invalid credentials');
    }

    const token = await generateToken(user._id);
    const refreshToken = await generateRefreshToken(user._id)

    user.refreshToken = refreshToken;
    await user.save()

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token,
        refreshToken
    }

}

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    registerUser,
    loginUser,
    refreshAccessToken
}