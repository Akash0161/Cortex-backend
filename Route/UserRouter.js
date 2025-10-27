const express = require('express')
const { Router } = express
const router = Router()

const { create, getbyid, getall, remove, update, imageupload, UserLogin, UserSignup, saveBlog , removeSavedBlog, updateDescription, getUserByIdSimple } = require('../Controller/UserController')

router.post('/create', create)
router.get('/getall', getall)

router.post('/update', update)
router.post('/imageupload', imageupload);

router.post('/usersignup', UserSignup)
router.post('/userlogin', UserLogin)
router.get('/getbyid/:userId', getbyid)

router.post('/updateDescription', updateDescription);
router.get('/getUserByIdSimple/:userId', getUserByIdSimple);




router.post('/saved', saveBlog);
router.post('/removesavedblog', removeSavedBlog);
// router.get('/saved/:userId', getSavedBlogs);

module.exports = router

