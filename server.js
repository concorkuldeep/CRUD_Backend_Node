require('dotenv').config();

const app = require('./src/app')
const connectDB = require('./src/config/db')
connectDB()

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{
    console.log(`Server is running on ${process.env.NODE_ENV} mode on port ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
  
  process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  });