const authService = require('../services/authService');

const { successResponse, errorResponse } = require('../utils/responses')


const register = async (req, res) => {
    try {
      const { name, email, password,phone } = req.body;
      
      const result = await authService.registerUser({
        name,
        email,
        password,
        phone
      });
      
      return successResponse(res, 201, 'User registered successfully', result);
    } catch (error) {
      console.error("Register Auth Controller :",error)
      return errorResponse(res, 400, error.message);
    }
  };


  const login = async (req,res) =>{
    try {
        const {email,password} = req.body;

        const result = await authService.loginUser(email,password)
        return successResponse(res,200,'Login Successful',result)
    } catch (error) {
        return errorResponse(res, 500, error.message);
    }
  }

  const getProfile = async (req, res) => {
    try {
      const user = req.user;
      
      return successResponse(res, 200, 'Profile retrieved successfully', {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      return errorResponse(res, 500, 'Server error');
    }
  };
  
  module.exports = {
    register,
    login,
    getProfile
  };