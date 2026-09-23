const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/UserModel');

const googleClient = new OAuth2Client(
    process.env.GOOGLE_WEB_CLIENT_ID
);


// Generate Access Token
const generateToken = async (userId) => {
    return jwt.sign(
        {
            id: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
};


// Generate Refresh Token
const generateRefreshToken = async (userId) => {
    return jwt.sign(
        {
            id: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRE
        }
    );
};


// Refresh Access Token
const refreshAccessToken = async (oldToken) => {
    if (!oldToken) {
        throw new Error('Refresh Token Required.');
    }

    const decoded = jwt.verify(
        oldToken,
        process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
        .select('+refreshToken');

    if (!user) {
        throw new Error('User not found');
    }

    if (user.refreshToken !== oldToken) {
        throw new Error('Token reuse detected');
    }

    const newRefreshToken =
        await generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;

    await user.save();

    return {
        token: await generateToken(user._id),
        refreshToken: newRefreshToken
    };
};


// Verify Application JWT
const verifyToken = (token) => {
    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    } catch (e) {
        return null;
    }
};


// Register User
const registerUser = async (userData) => {

    const existingUser = await User.findOne({
        email: userData.email
    });

    if (existingUser) {
        throw new Error('Email already registered');
    }

    const user = await User.create(userData);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
};


// Email + Password Login
const loginUser = async (email, password) => {

    const user = await User.findOne({
        email
    }).select('+password');

    if (
        !user ||
        !await user.comparePassword(password)
    ) {
        throw new Error('Invalid credentials');
    }

    const token =
        await generateToken(user._id);

    const refreshToken =
        await generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token,
        refreshToken
    };
};


// Google Login
const googleLogin = async (idToken) => {

    if (!idToken) {
        throw new Error(
            'Google ID token is required'
        );
    }

    try {

        const ticket =
            await googleClient.verifyIdToken({
                idToken,
                audience:
                    process.env.GOOGLE_WEB_CLIENT_ID
            });

        const payload =
            ticket.getPayload();

        const {
            sub: googleId,
            email,
            email_verified,
            name,
            picture
        } = payload;



        if (!email) {
            throw new Error(
                'Google email not found'
            );
        }

        if (!email_verified) {
            throw new Error(
                'Google email is not verified'
            );
        }


        let user = await User.findOne({
            $or: [
                {
                    googleId
                },
                {
                    email: email.toLowerCase()
                }
            ]
        }).select('+refreshToken');


        if (!user) {

            user = await User.create({
                name:
                    name ||
                    email.split('@')[0],

                email:
                    email.toLowerCase(),

                googleId,

                profileImage:
                    picture || null,

                authProvider: 'google',

                role: 'user'
            });

        }


        else {

            if (!user.googleId) {
                user.googleId = googleId;
            }
            if (
                !user.profileImage &&
                picture
            ) {
                user.profileImage = picture;
            }

            await user.save();
        }


        const token =
            await generateToken(user._id);

        const refreshToken =
            await generateRefreshToken(user._id);


        user.refreshToken = refreshToken;

        await user.save();

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileImage: user.profileImage
            },

            token,

            refreshToken
        };

    } catch (error) {

        console.error(
            'Google Login Service:',
            error.message
        );

        throw new Error(
            error.message ||
            'Google authentication failed'
        );
    }
};


// Logout
const logoutUser = async (email) => {

    const user = await User.findOne({
        email
    }).select('+password +refreshToken');

    if (!user) {
        throw new Error(
            'Invalid User Email'
        );
    }

    if (user.refreshToken) {

        user.refreshToken = null;

        await user.save();
    }

    return true;
};


module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    registerUser,
    loginUser,
    googleLogin,
    refreshAccessToken,
    logoutUser
};