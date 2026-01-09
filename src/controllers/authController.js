const authService = require('../services/authService');

const { successResponse, errorResponse } = require('../utils/responses')


const register = async (req, res) => {
    try {
      const { name, email, password,phone,role } = req.body;
      
      const result = await authService.registerUser({
        name,
        email,
        password,
        phone,
        role
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
          phone:user.phone,
          createdAt: user.createdAt,
          role:user.role
        }
      });
    } catch (error) {
      return errorResponse(res, 500, 'Server error');
    }
  };

  const refreshToken = async(req,res) =>{
try {

  const {refreshToken} = req.body;
  const accessToken = await authService.refreshAccessToken(refreshToken);
   return successResponse(res,200,'Token Refreshed Successfully',accessToken)
} catch (error) {
  return errorResponse(res,500,'Server Error')
}
  }

  const logOutHandler = async(req,res) =>{
  const {email} = req.body;
  const response = await authService.logoutUser(email);
  if(response){
    successResponse(res,200, 'User Logged out successfully.')
  }
  }
  
  module.exports = {
    register,
    login,
    getProfile,
    refreshToken,
    logOutHandler
  };