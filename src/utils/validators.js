const { body, param } = require('express-validator');

// Fixed validators without syntax errors
const registerValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('phone')
    .isLength({max:10}).withMessage('Phone no should be atleast 10 digits')
];

const loginValidator = [
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

const productValidator = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .trim()
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .isIn(['electronics', 'clothing', 'books', 'home', 'other'])
    .withMessage('Invalid category')
];

// Add param validator for product ID
const productIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format')
];

module.exports = {
  registerValidator,
  loginValidator,
  productValidator,
  productIdValidator
};