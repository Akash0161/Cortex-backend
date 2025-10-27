const Model = require('../Model/AdminModel')

exports.create = async(req,res)=>{
    try{
        const {name,password,email,mobile_number} = req.body
        const User = new Model({name,password,email,mobile_number})
        await User.save()
        return res.json({Message:'Account Created Successfully',User})
    }
    catch(err){
        return res.json({Message:'Already Exists',Error:err.message})
    }
}

exports.getall = async(req,res)=>{
    try{
        const User = await Model.find({})
        return res.json({Message:"Fetched successfully",Doc})
    }
    catch(err){
        return res.json({Message:"Something went wrong",Error:err.message})
    }
}

exports.getbyid = async(req,res)=>{
    try{
        const {id} = req.body
        const User = await Model.findById(id)
        if(!User) return res.json({Message:"Document not found",Error:err.message})
        return res.json({Message:"Success",User})
    }
    catch(err){
        return res.json({Message:"Not Found",Error:err.message})
    }

}

exports.remove = async(req,res)=>{
    try{
    const {id} = req.body
    const User = await Model.findByAndDelete(id)
    if(!User) return res.json({Message:"No Document Found",Error:err.message})
    return res.json({Message:"Deleted Successfully"})
    }
    catch(err){
        return res.json({Message:"Something Went Wrong"})
    }

}

exports.update = async(req,res)=>{
    try{
        const {id} = req.query
        const {name,password,email,mobile_number} = req.body
        const updateobj ={}
        if(name,password){
            updateobj.name=name
            updateobj.password=password
            updateobj.email=email
            updateobj.mobile_number=mobile_number
        }
        const User = await Model.findByIdAndUpdate(id,updateobj,{new:true})
        if(!User) return res.json({Message:"Not Found",Error:err.message})
        return res.json({Message:"Updated Successfully",User})
    }
    catch(err){
        return res.json({Message:"Something Went Wrong",Error:err.message})
    }
}

exports.AdminSignup = async(req,res)=>{
    try{
    const {name,password,email,mobile_number} = req.body
    const User = new Model({name,password,email,mobile_number})
    await User.save()
    return res.json({Message:"Account Created Successfully",User})
    }
    catch(err){
        return res.json({Message:"Something Went Wrong",Error:err.message})
    }
}

exports.AdminLogin = async(req,res)=>{
    try{
        const {name,password} = req.body
        const User= await Model.findOne({name})
        if (!User) {
          return res.json({Message:'invalid Username or Password'})  
        }
        return res.json({Message:"Welcome",User})
    }
    catch(err){
        return  res.json({Message:"Something went wrong",Error:err.message})
    }
}
