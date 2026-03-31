const mongoose = require('mongoose');
const mongodb = process.env.MONGO_URI;
const connectDB = async ()=> {
    try {
        await mongoose.connect(mongodb)
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
    }
}
module.exports = connectDB;