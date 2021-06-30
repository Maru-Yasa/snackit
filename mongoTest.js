const mongoose = require('mongoose')
const User = require('./models/user')
const db = require('./database/mongo')

async function mongo(){
    await db.once('open',() => {
        console.log('mongo ok!');
    })
    await db.on('error',(err) => {
        console.log(err);
    })
    let data = new User({
        Username:"admin",
        Password:"400307"
    })
    await data.save((err,data) => {
        if (err) return console.log(err)
        return console.log(data)
    })
}

mongo()