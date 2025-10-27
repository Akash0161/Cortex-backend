 const express = require('express')
const {Router} = express
const router = Router()

const { getbyid, postgetall, remove, update,imageupload, NewPost, getBlogsByUser, searchBlogs } = require('../Controller/BlogController')

router.post('/newpost',NewPost)
router.get('/getbyid',getbyid)
router.get('/postgetall',postgetall)
router.post('/remove',remove)
router.post('/imageupload',imageupload)
router.post('/update',update)   
router.post('/user',getBlogsByUser)
router.get('/search', searchBlogs);


module.exports = router