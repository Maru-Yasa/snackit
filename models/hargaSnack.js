const mongoose = require('mongoose');
const { Schema } = mongoose;

const hargaSchema = new Schema({
    Name:{
        type:String,
        required:true
    },
    "1ons":{
        type:String
    },
    "1/4kg":{
        type:String
    },
    "1/2kg":{
        type:String
    },
    "1kg":{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},{ timestamps: true });

const HargaSnack = mongoose.model("hargaSnack",hargaSchema)
module.exports = HargaSnack