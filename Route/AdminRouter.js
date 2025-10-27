const express = require('express')
const {Router} = express
const router = Router()

const {create,getall,getbyid,update,remove,AdminLogin,AdminSignup} = require('../Controller/AdminController')

router.post('/create',create)
router.get('/getbyid',getbyid)
router.get('/getall',getall)
router.post('/update',update)
router.post('/remove',remove)
router.post('/adminlogin',AdminLogin)
router.post('/adminsignup',AdminSignup)

module.exports = router