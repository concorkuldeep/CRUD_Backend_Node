const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo Db Connected on PORT : ${process.env.PORT}`)
    } catch (e) {
        console.error(`Error while connecting Mongo DB : `, e);
        process.exit(1)
    }
}

module.exports = connectDB;