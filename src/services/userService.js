const User = require('../models/UserModel');

const getUser = async ({ id, email }) => {
    let query = {};
    if (id) {
        query._id = id;
    }

    if (email) {
        query.email = email;
    }

    if (!id && !email) {
        throw new Error('User id or user email required.');
    }

    const user = await User
        .findOne(query)
        .select('+password')
        .lean();

    if (!user) {
        return null;
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        role: user.role,
        profileImage: user.profileImage,
        authProvider: user.authProvider,
        password: !!user.password
    };
};

module.exports = {
    getUser
};