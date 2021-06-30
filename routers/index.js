const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()

// router.set('view engine','ejs')
router.use(express.urlencoded({extended: true}))
router.use(express.json())

async function getAll(){
    let res = await axios.get(`${process.env.BASE_URL}/api`)
    return res
}

async function getByQuery(query){
    let res = await axios.get(`${process.env.BASE_URL}/api/cari?query=${query}`)
    return res
}

router.route('/')
    .get(async(req,res) => {
        let query = req.query
        if(query.query){
            let data = await getByQuery(query.query)
            return res.render('index',data=data.data || [])
        }
        let data = await getAll()
        return res.render('index',data=data || [])
    })


module.exports = router