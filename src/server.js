const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000
const connectDB = require('./config/db');
app.use(express.json());
connectDB();
app.get('/', (req, res) => {
    return res.json({message: "API is running..."});
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})