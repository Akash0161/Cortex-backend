const mongoose = require('mongoose')
const {Schema,model} = mongoose

const BlogSchema = new Schema({
  image: String,
  Title: String,
  Description: String,
  Category: String,
  Createdby:String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
},{
  timestamps: true // ✅ auto add createdAt & updatedAt
});

module.exports=model('Blog',BlogSchema)