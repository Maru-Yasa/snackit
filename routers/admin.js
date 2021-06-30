const express = require('express')
const router = express.Router()
const axios = require('axios')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const HargaSnack = require('../models/hargaSnack')
require('dotenv').config()
router.use(require('express-session')({
  secret: 'asdhjahskdhkhajkshd',
  resave: false,
  saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({extended: true}))
router.use(express.json())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

async function getAll(){
    let res = await axios.get(`${process.env.BASE_URL}/api`)
    return res
}

async function getByQuery(query){
    let res = await axios.get(`${process.env.BASE_URL}/api/cari?query=${query}`) 
    return res 
}

async function getproduct(id){
  let res = await axios.get(`${process.env.BASE_URL}/api/product/${id}`)
  return res
}


router.route('/')
  .get(async(req,res) => {
    let query = req.query
    if(req.isAuthenticated()){
        if(query.query){
          let data = await getByQuery(query.query)
          return res.render('adminIndex',data=data.data || [])
      }
      return res.redirect('/admin/dashboard')
    }
    return res.render('login')
  })

router.route('/register')
  .get((req,res) => {
    if(req.isAuthenticated()){
      return res.render('register')
    }
    return res.redirect('/admin')
  })

router.post('/register', (req, res, next) => {
  if(req.isAuthenticated()){
    User.register(new User({
        username: req.body.username
      }),
      req.body.password, (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            err: err
          });
        } else {
          passport.authenticate('local')(req, res, () => {
            User.findOne({
              username: req.body.username
            }, (err, person) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({
                success: true,
                status: 'Registration Successful!',
              });
            });
          })
        }
      })
  }else{
    res.redirect('/admin')
  }
  });

router.post('/', passport.authenticate('local',{ failureRedirect: '/admin' }), (req, res) => {
  let username = req.body.username
    User.findOne({
      username: username.toLowerCase()
    }, (err, person) => {
      if(err) return res.redirect('/admin')
      res.statusCode = 200;
      res.redirect('/admin/dashboard')
    })
  });

router.route('/dashboard')
.get(async(req,res) => {
  if(req.isAuthenticated()){
    let query = req.query
    if(query.query){
        let data = await getByQuery(query.query)
        return res.render('adminIndex',data=data.data || [])
    }
    let data = await getAll()
    return res.render('adminIndex',data=data || [])
  }else{
    return res.redirect('/admin')
  }
})

router.route('/dashboard/product/:id')
  .get(async(req,res) => {
    if(req.isAuthenticated()){
      data = await getproduct(req.params.id) 
      res.render('product',data={data:data.data.data})
    }else{
      res.redirect('/admin')
    }

  })
  .post(async (req,res) => {
    if(req.isAuthenticated()){
      let body = req.body
      let SubmitData = {
        Name:body.name,
        "1ons":body['1ons'],
        "1/4kg":body['1/4kg'],
        "1/2kg":body['1/2kg'],
        "1kg":body['1kg'],
  
      }
      await HargaSnack.findByIdAndUpdate(body.id,SubmitData,async (err,_) => {
        let data = await getproduct(req.params.id) 
        if(err) return res.render('product',data={data:data.data.data})
        return res.render('product',data={data:data.data.data})
  
      })
    }else{
      res.redirect('/admin')
    }
  })

  router.route('/dashboard/product/:id/delete')
    .post(async (req,res) => {
      if(req.isAuthenticated()){
        let param = req.params
        await HargaSnack.findByIdAndDelete(param.id)
        res.redirect('/admin')
      }else{
        res.redirect('/admin')
      }
    })

  router.route('/dashboard/add')
    .get(async (req,res) => {
      if(req.isAuthenticated()){
        res.render('add')
      }else{
        res.redirect('/admin')
      }
    })
    .post(async(req,res) => {
      if(req.isAuthenticated()){
        let body = req.body
        let data  = new HargaSnack({
          Name:body.name,
          "1ons":body['1ons'],
          "1/4kg":body['1/4kg'],
          "1/2kg":body['1/2kg'],
          "1kg":body['1kg'],
        })
        await data.save((err,_data) => {
          if(err) return res.send('failed')
          return res.render('product',data={data:_data})
        })
      }else{
        res.redirect('/admin')
      }
    })

module.exports = router