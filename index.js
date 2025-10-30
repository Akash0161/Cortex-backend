const express = require('express')
const HTTP_SERVER = express()
const cors = require('cors')
const PORT = process.env.PORT || 3000
require('./dbConfig')
const path = require('path')

HTTP_SERVER.use(cors())
HTTP_SERVER.use(express.json())
HTTP_SERVER.use(express.urlencoded({extended:false}))

const imagePath = path.join(process.cwd(), 'Controller', 'Data', 'Image');
HTTP_SERVER.use('/api/Data/Image/',express.static(imagePath));

HTTP_SERVER.get('/', (req, res) => {
    res.send('API is working')
})

HTTP_SERVER.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})

HTTP_SERVER.use('/', require('./app'))