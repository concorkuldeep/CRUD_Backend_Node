const userService = require('../services/userService');
const { errorResponse, successResponse } = require('../utils/responses');

const getUser = async (req, res) => {
    try {
        const { id, email } = req.query;
        const user = await userService.getUser({ id, email })
        if (!user) {
            return errorResponse(res, 404, 'User Not Found', {
                ...id && { id: id },
                ...email && { email: email }
            })
        }

        return successResponse(res,200,'User Retrieved Successfully', {
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone:user.phone,
              createdAt: user.createdAt
            }
          })


    } catch (error) {
        return errorResponse(res, 500, 'Server error : Get User');

    }

}

module.exports = {
    getUser
}