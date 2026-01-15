const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes')
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



// Test Route

app.get('/', (req,res)=>{
    res.json({
        message:' Welcome to node js crud application',
        success:true
    })
})



app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/task',taskRoutes)

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`
    });
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'dev' && { stack: err.stack })
    });
  });


  
  module.exports = app;