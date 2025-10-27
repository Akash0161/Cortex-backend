const { default: mongoose } = require('mongoose');
const Model = require('../Model/UserModel')
const User = require('../Model/UserModel');

exports.create = async (req, res) => {
    try {
        const { name, password, email, gender } = req.body
        const Doc = new Model({ name, password, email, gender }) //object shorthand {name:name}
        await Doc.save()
        return res.json({ Message: "Account Created Successfully", Doc })
    }
    catch (err) {
        return res.json({ Message: "Already exits", Error: err.message })
    }
}

exports.getall = async (req, res) => {
    try {
        const Doc = await Model.find({})
        return res.json({ Message: "Fetched Successfully", Doc })
    }
    catch (err) {
        return res.json({ Message: "Something went wrong", Error: err.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.body
        const { name, email, gender, password } = req.body
        const updateobj = {}
        if (gender, name, email, password) {
            updateobj.name = name
            updateobj.email = email
            updateobj.password = password
            updateobj.phone_number = phone_number

        }
        const Doc = await Model.findByIdAndUpdate(id, updateobj, { new: true })
        if (!Doc) return res.json({ Message: "No Document Found" })
        return res.json({ Message: "Updated Successfully", Doc })
    }
    catch (err) {
        return res.json({ Message: "Something went wrong", Error: err.message })
    }
}

exports.updateDescription = async (req, res) => {
  try {
    const { userId, description } = req.body;

    if (!userId || description === undefined) {
      return res.status(400).json({ Message: "userId and description are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { description },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ Message: "User not found" });
    }

    return res.json({ Message: "Description updated successfully", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ Message: "Something went wrong", Error: err.message });
  }
};


exports.getUserByIdSimple = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('name email description');
    if (!user) return res.status(404).json({ Message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ Message: 'Something went wrong', Error: err.message });
  }
};


exports.getbyid = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'blogs',
          localField: 'savedBlogs',
          foreignField: '_id',
          as: 'savedBlogsInfo'
        }
      },
      {
        $unwind: {
          path: "$savedBlogsInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users', // link to blog author
          localField: 'savedBlogsInfo.userId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: "$author" },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          savedBlogsInfo: {
            $push: {
              _id: "$savedBlogsInfo._id",
              image: "$savedBlogsInfo.image",
              Title: "$savedBlogsInfo.Title",
              Category: "$savedBlogsInfo.Category",
              Description: "$savedBlogsInfo.Description",
              createdAt: "$savedBlogsInfo.createdAt",
              userId: {
                _id: "$author._id",
                name: "$author.name",
                email: "$author.email",
                gender: "$author.gender",
                
              }
            }
          }
        }
      }
    ]);

    if (!user || !user.length) {
      return res.status(404).json({ Message: 'User not found' });
    }

    return res.json({
      Message: 'Saved blogs found',
      blogs: user[0].savedBlogsInfo
    });

  } catch (err) {
    return res.status(500).json({ Message: 'Something went wrong', Error: err.message });
  }
};


exports.remove = async (req, res) => {
    try {
        const { id } = req.body
        const Doc = await Model.findByIdAndDelete(id)
        if (!Doc) return res.json({ Message: "No Document Found" })
        return res.json({ Message: "Deleted Successfully" })
    }
    catch (err) {
        return res.json({ Message: "Something went wrong", Error: err.message })
    }
}


//UsersignUp

exports.UserSignup = async (req, res) => {
    try {
        const { name, password, email, gender } = req.body;
        const existing_user = await Model.findOne({ name });
        if (existing_user) {
            return res.json({ Message: "User already exists" })
        }
        const User = new Model({ name, password, email, gender })
        await User.save()
        return res.json({ Status: true, Message: "Account Created Successfully", User })
    }
    catch (err) {
        return res.json({ Status: false, Message: "Something Went Wrong", Error: err.message })
    }
}


// UserLogin
exports.UserLogin = async (req, res) => {
    try {
        const { name, password } = req.body;
        const User = await Model.findOne({ name });

        if (!User) {
            return res.json({ Status: false, Message: "No User found" });
        }

        if (User.password !== password) {
            return res.json({ Status: false, Message: "Invalid Username or Password" });
        }
        return res.json({ Status: true, Message: "Welcome", User });
    }

    catch (err) {
        return res.json({ Status: false, Message: "Something went wrong", Error: err.message, });
    }
};




//todo authentication

// exports.login = async(req,res)=>{
//     try{
//         const {name,password} = req.body;
// checking if name and pass exist
// if (!name || !password) {
//     return res.status(400).json({Message:"Please provide valid username and password"})
// }
// checking if user details valid
// const user = AdminModel.findOne({name})
// if(!user || !(await user.correctPassword(password,user.password))){
//     return res.status(401).json({Message:"Incorrect details"})
// }

// console.log(user)

// 3) If everything ok, send token to client
//         const token=signToken(user._id);
//         res.status(200).json({
//             status:'success',
//             token
//         })}
//         catch (err) {
//             console.log(err);
//             return res.json({
//                 error: true,
//                 errorMessage: "An error has occurred.",
//                 message : err.message
//             })

//     }
// }

exports.imageupload = async (req, res, next) => {
    try {
        let uploadedFileName = '';
        const filePath = path.join(__dirname + '/Data/Image');
        const UploadStorage = multer.diskStorage({
            destination: filePath,
            filename: (req, file, cb) => {
                const originalname = file.originalname;
                const fileExtension = path.extname(originalname);
                const uniqueSuffix = Date.now();
                const newFileName = path.basename(originalname, fileExtension) + '_' + uniqueSuffix + fileExtension;
                uploadedFileName = '/Data/Image/' + newFileName;
                cb(null, newFileName)
            }
        });
        const upload = multer({ storage: UploadStorage }).single('image');

        upload(req, res, async function (err) {
            if (err) {
                return res.status(500).json({ command: "Error Uploading file", err })
            }
            res.status(200).json({ ImageUploaded: uploadedFileName })
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//save blog

exports.saveBlog = async (req, res) => {
    try {
        const { userId, blogId } = req.body;

        if (!userId || !blogId) {
            return res.status(400).json({ Status: false, Error: 'userId and blogId required' });
        }

        // prevent duplicates
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ Status: false, Error: 'User not found' });

        if (!user.savedBlogs.includes(blogId)) {
            user.savedBlogs.push(blogId);
            await user.save();
        }

        return res.json({ Status: true, Message: 'Blog saved successfully', user });
    } catch (err) {
        return res.status(500).json({ Status: false, Error: err.message });
    }
};

//get savedblogs

exports.getSavedBlogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .populate('savedBlogs', 'image Title Category Description ')
            

        if (!user) return res.status(404).json({ Message: 'User not found' });

        return res.json({
            Message: 'Saved blogs found',
            blogs: user.savedBlogs
        });
    } catch (err) {
        return res.status(500).json({ Message: 'Something went wrong', Error: err.message });
    }
};


//remove saved blog

exports.removeSavedBlog = async (req, res) => {
  try {
    const { userId, blogId } = req.body;

    if (!userId || !blogId) {
      return res.status(400).json({ status: false, Error: 'userId and blogId required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ Status: false, Error: 'User not found' });
    }

    user.savedBlogs = user.savedBlogs.filter(
      (savedId) => savedId.toString() !== blogId.toString()
    );
    await user.save();

    return res.json({
      Status: true,
      Message: 'Blog removed from saved blogs successfully',
      user,
    });
  } catch (err) {
    return res.status(500).json({ Status: false, Error: err.message });
  }
};