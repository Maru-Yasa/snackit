const express = require('express')
const app = express()
const apiRouter = require('./routers/api')
const indexRouter = require('./routers/index')
const adminRouter = require('./routers/admin')
require('dotenv').config()

app.set('view engine','ejs')
app.use(express.urlencoded({extended: true}));
app.use(express.json())


app.use('/', indexRouter)
app.use('/admin', adminRouter)
app.use('/api', apiRouter)


app.listen(process.env.PORT||3000,() => {
  console.log(`server ok!`)

})