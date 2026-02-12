const mongoose = require("mongoose")
require("dotenv").config()

const MONGODBURL = process.env.MONGOURL
async function connectDB() {
    try {
        await mongoose.connect(MONGODBURL)
        console.log("banco conectado")
    } catch (error) {
        console.log(error)
    }
}
module.exports = connectDB