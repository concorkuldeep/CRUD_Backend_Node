const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const {ErrorResponse,SuccessResponse} = require('../utils/responses')

const generateToken = (userId) =>{
    return jwt.sign({
        id:userId
    },process.env.JWT_SECRET,
{expiresIn:process.env.JWT_EXPIRE})

}


const verifyToken = (token)  =>{
    try{
     return jwt.verify(token,process.env.JWT_SECRET)
    }catch(e){
    return null;
    }
}

const registerUser = async(userData) =>{
const existingUser = await User.findOne({email:userData.email})
if(existingUser){
    throw new Error('Email already registered');
}

const user = await User.create(userData);
const token = generateToken(user._id)
return{
    user:{
    id:user._id,
    name:user.name,
    email:user.email
    },
    token
}

}

const loginUser = async (email,password) =>{
    const user = await User.findOne({email}).select('+password');
    if(!user || !await user.comparePassword(password)){
      
        throw new Error('Invalid credentials');
    }

    const token = await generateToken(user._id)

    return {
        user:{
            id:user._id,
        name:user.name,
        email:user.email
        },
        token
    }

}

module.exports = {
    generateToken,
    verifyToken,
    registerUser,
    loginUser
}