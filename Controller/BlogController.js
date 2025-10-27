const multer = require('multer')
const model = require('../Model/BlogModel')
const { imageupload } = require('./UserController')
const path = require('path')


exports.postgetall = async (req, res) => {
  try {
    const blog = await model.find({}).populate('userId', 'name gender email').sort({createdAt: -1}); // populate user's name
    return res.json({ Message: "All results found", blog });
  } catch (err) {
    return res.json({ Message: "Something Went Wrong", Error: err.message });
  }
};

exports.getbyid = async(req,res)=>{
    try{
        const {id} = req.body
        const blog = await model.findById(id)
        if(!blog) return res.json({Message:"Not found"})
        return res.json({Message:"Results found",blog})
    }
    catch(err){
        return res.json({Message:"Not found",Error:err.message})
    }
}

exports.remove = async(req,res)=>{
    try{
        const {id} = req.body
        const blog = await model.findByIdAndDelete(id)
        if(!blog) return res.json({Message:"No results found"})
        return res.json({Message:"Deleted Successfully"})
    }
    catch(err){
        return res.json({Message:"Something Went Wrong",Error:err.message})
    }
}

exports.update = async(req,res)=>{
    try{
        const{id}= req.query
        const{Caption,Description,Content} = req.body
        const updateobj={}
       if (Caption) updateobj.Title = Title;
        if (Description) updateobj.Description = Description;
        if (Content) updateobj.Category = Category;

        const blog = await model.findByIdAndUpdate(id,updateobj,{new:true})
        if(!blog) return res.json({Message:'No Document Found'})
        return res.json({Message:"Updated Successfully",blog})
    }
    catch(err){
        return res.json({Message:"Something Went Wrong",Error:err.message})
    }
}

exports.NewPost = async (req, res) => {
  try {
    const { image, Title, Category, Description, userId } = req.body;
    const blog = new model({ image, Title, Category, Description, userId });
    await blog.save();
    return res.json({ Message: "Posted Successfully", blog });
  } catch (err) {
    return res.json({ Message: "Something Went Wrong", Error: err.message });
  }
};

exports.imageupload = async(req,res,next)=>{
    try{
        let uploadedFileName = ''
        const filepath = path.join(__dirname + '/Data/Image');
        const UploadStorage = multer.diskStorage({
            destination:filepath,
            filename:(req,file,cb)=>{
                const originalname = file.originalname;
                const fileExtension = path.extname(originalname);
                const uniqueSuffix = Date.now();
                const newFileName = path.basename(originalname,fileExtension)+ "_" + uniqueSuffix + fileExtension;
                uploadedFileName = 'api/Data/Image/' + newFileName;
                cb(null,newFileName)
            }
        });
        const upload = multer({storage:UploadStorage}).single('image');
        upload(req,res,async function (err) {
            if (err) {
                return res.status(500).json({command:"Error uploading file",err})
            }
            res.status(200).json({imageupload:uploadedFileName})
        });
    } 
    catch(err){
        res.status(500).json({message:err.message});
    }
}


// exports.create = async(req,res)=>{
//     try{
//     const {image,Title,Description,Category} = req.body
//     const blog = new model({image,Title,Description,Category})
//     await blog.save()
//     return res.json({Message:'New Blog Added',blog})
//     }
//     catch(err){
//         return res.json({Message:"Something Went Wrong",Error:err.Message})
//     }
// }


//profile section 

exports.getBlogsByUser = async (req, res) => {
  try {
    const { userId } = req.body;  // /blog/user for postman

    // find blogs that have this userId
    const blogs = await model
      .find({ userId })
      .populate('userId', 'name email gender')
      .sort({ createdAt: -1 }); 

    if (!blogs || blogs.length === 0) {
      return res.json({ Message: 'No blogs found for this user' });
    }

    return res.json({ Message: 'User blogs found', blogs });
  } catch (err) {
    return res
      .status(500)
      .json({ Message: 'Something went wrong', Error: err.message });
  }
};


//searchblog

exports.searchBlogs = async (req, res) => {
  try {
    const { query } = req.query; 

    if (!query || query.trim() === "") {
      return res.status(400).json({ Message: "Search query required" });
    }

    const blogs = await model.aggregate([
      {
        $lookup: {
          from: "users", // Mongo collection for users
          localField: "userId",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" },
      {
        $match: {
          $or: [
            { Title: { $regex: query, $options: "i" } },
            { Category: { $regex: query, $options: "i" } },
            { "author.name": { $regex: query, $options: "i" } }
          ]
        }
      },
      {
        $project: {
          Title: 1,
          Category: 1,
          Description: 1,
          image: 1,
          "author.name": 1,
          "author.email": 1,
          createdAt: 1
        }
      },
      { $sort: { createdAt: -1 } } 
    ]);

    return res.json({
      Message: "Search results",
      count: blogs.length,
      blogs
    });
  } catch (err) {
    console.error("Error in searchBlogs:", err);
    return res
      .status(500)
      .json({ Message: "Something went wrong", Error: err.message });
  }
};