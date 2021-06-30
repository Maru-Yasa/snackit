const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},{ timestamps: true });

userSchema.plugin(passportMongoose)

const User = mongoose.model("User",userSchema)
module.exports = User