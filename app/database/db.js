require('dotenv').config()
const mongoose = require('mongoose');
exports.connectMongoose =()=>{
    mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true
    })
    .then((e)=>console.log("Connected to Mongodb =>> Nodejs Authentication App"))
    .catch((e)=>console.log("Mongodb connection problem"))
}
