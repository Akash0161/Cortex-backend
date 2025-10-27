const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new Schema({
    name: { type: String, unique: true },
    password: { type: String },
    email: { type: String },
    gender: { type: String },
    description: { type: String, default: "Write something about yourself..." },
    profilePic: { type: String, default: "/api/Data/Image/defaultprofilepic.webp" },
    savedBlogs: [
        { type: mongoose.Types.ObjectId, ref: 'blog' },
    ]
})

module.exports = model('user', UserSchema)