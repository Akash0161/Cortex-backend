const mongoose = require('mongoose')
const {Schema,model} = mongoose

const AdminSchema = new Schema({
    name:{type:String},
    password:{type:String},
    email:{type:String},
    mobile_number:{type:Number}
})

exports.module = model('admin',AdminSchema)