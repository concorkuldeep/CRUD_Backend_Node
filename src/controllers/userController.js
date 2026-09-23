const userService = require('../services/userService');
const {
    errorResponse,
    successResponse
} = require('../utils/responses');

const getUser = async (req, res) => {
    try {
        const { id, email } = req.user;

        const user = await userService.getUser({
            id,
            email
        });

        if (!user) {
            return errorResponse(
                res,
                404,
                'User Not Found',
                {
                    ...(id && { id }),
                    ...(email && { email })
                }
            );
        }


        return successResponse(
            res,
            200,
            'User Retrieved Successfully',
            {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    createdAt: user.createdAt,
                    role: user.role,
                    profileImage: user.profileImage,
                    authProvider: user.authProvider,
                    password: user.password
                }
            }
        );

    } catch (error) {
        console.log('Get User Error:', error);

        return errorResponse(
            res,
            500,
            'Server error : Get User'
        );
    }
};

module.exports = {
    getUser
};