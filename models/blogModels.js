const mongoose = require("mongoose");
const path=require('path');
const multer=require('multer');
const imagePath='/uploads/userImges';
const videosPath='/uploads/userImges/Videos';

const BlogSchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    titleName: {
        type: String,
        required: true
    },
    aboutName: {
        type: String,
        required: true
    },
    blogStatus: {
        type: Boolean,
        required: true,
        default: true
    },
    Blogimage:{
        type:String,
        require:true 
    },
    BlogVideo:{
        type:String,
        require:true 
    },

}, {
    timestamps: true
})


const StorageImage=multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname=='Blogimage'){
            cb(null,path.join(__dirname,'..',imagePath));
        }else if(file.fieldname=='BlogVideo'){
            cb(null,path.join(__dirname,'..',videosPath));
        }
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now());
    }
})
BlogSchema.statics.uploadImageFile=multer({storage:StorageImage}).fields([{
    name: 'Blogimage', maxCount: 1
  }, {
    name: 'BlogVideo', maxCount: 1
  }]);
BlogSchema.statics.imagePath=imagePath;
BlogSchema.statics.videoPath=videosPath;


const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;