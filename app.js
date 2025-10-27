const express = require('express')
const router = express()

router.use('/user',require('./Route/UserRouter'))

router.use('/admin',require('./Route/AdminRouter'))

router.use('/blog',require('./Route/BlogRouter'))




module.exports = router


