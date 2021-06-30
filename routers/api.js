const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const db = require('../database/mongo')
const HargaSnack = require('../models/hargaSnack')
require('dotenv').config()


db.once('open',() => {
    console.log('mongo ok!');
})
db.on('error',(err) => {
    console.log(err);
})

router.use(express.urlencoded({extended: true}))
router.use(express.json())

//NOTE:READ,CREATE
router.route('/')
    .get(async (req,res) => {
        var data = null
        await HargaSnack.find((err,_data) => {
            itemCount:_data.length,
            data = _data
        })
        return res.send(data)
    })
    // .post((req,res) => {
    //     let bodyData = req.body
    //     try{
    //         console.log(bodyData)
    //         let _data = new HargaSnack({
    //             Name:"test"
    //         })
    //         _data.save((err) => {
    //             if(err) return res.status(500).send({
    //                 error:err
    //             })
    //             return res.status(200).send({
    //                 massage:"succes",
    //                 data:_data
    //             })
    //         })

    //     }catch(error){
    //         return res.status(404).send({
    //             error:error
    //         })
    //     }
    // })

//NOTE:SEARCH
router.route('/cari')
    .get(async (req,res) => {
        let query = req.query
        if(query.query){
            await HargaSnack.find({'Name':{$regex:new RegExp(query.query, "i")}},(err,_data)=>{
                return res.status(200).send({
                    data:_data
                })
            })
        }else(
            res.status(404).send({
                error:"query of null"
            })
        )
    })


// NOTE:UPDATE
// TODO:DELETE
router.route('/product/:id')
    .get(async(req,res) => {
        let query = req.query
        let param  = req.params
        try{
            if(param.id){
                await HargaSnack.findById(param.id, (err,_data) => {
                    if (_data) return res.status(200).send({
                        data:_data
                    })
                    return res.status(404).send({
                        error:err
                    })
                })
            }
        }catch(error){

        }
    })
    // .put(async(req,res) => {
    //     let param  = req.params
    //     try{
    //         if(param.id){
    //             console.log(req.body);
    //             await HargaSnack.findByIdAndUpdate(param.id, req.body, (err,_data) => {
    //                 if(_data) return res.status(200).send({
    //                     massage:"succes"
    //                 })
    //                 return res.status(500).send({
    //                     error:err
    //                 })
    //             })
    //         }
    //     }catch(error){

    //     }
    // })
    // .post((req,res) => {
    //     res.send(req.body)
    // })
    // .delete(async (req,res) => {
    //     let body = req.body
    //     let param = req.params
    //     try{

    //         await HargaSnack.findByIdAndDelete(param.id,(err) => {
    //             if(err) return res.status(500).send({
    //                 error:err
    //             })
    //             return res.status(200).send({
    //                 massage:"succes"
    //             })
    //         }) 

    //     }catch(error){
    //         return res.status(404).send({
    //             error:error
    //         })
    //     }
    // })



module.exports = router
