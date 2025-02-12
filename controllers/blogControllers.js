const Blog = require("../models/blogModels");
const category = require("../models/categoryModel");
const { validationResult } = require('express-validator');
const fs = require('fs')
const path = require('path')


module.exports.addBlog = async (req, res) => {
    try {
        let categoryData = await category.find();
        console.log(categoryData);
        
        return res.render("Blog/addBlog", {
            categoryData,
            errorData : [],
            oldData : []
        });
    }
    catch {
        console.log("something is wrong");
        return res.redirect("back");
    }
}
module.exports.insertBlog = async (req, res) => {
  try {
    const error = await validationResult(req);
    console.log(error.mapped());
    let categoryData = await category.find();
    if (!error.isEmpty()) {
        return res.render('Blog/addBlog',{
          errorData : error.mapped(),
          oldData : req.body,
          categoryData 
        })
    }

    req.body.blogStatus = true;
    console.log(req.files);

    let Blogimage = "";
    // let Blogvideo = "";

    if (req.files.Blogimage) {
        console.log("image")
      Blogimage = Blog.imgPath + "/" + req.files.Blogimage[0].filename;
    }
    // if (req.files.BlogVideo) {
    //     console.log("video")
    //   Blogvideo = Blog.videoPath + "/" + req.files.BlogVideo[0].filename;
    // }

    req.body.Blogimage = Blogimage;
    // req.body.BlogVideo = Blogvideo;

    let blogData = await Blog.create(req.body);
    if (blogData) {
        let findcategory = await category.findById(req.body.categoryId);
        findcategory.blogid.push(blogData._id);
        await category.findByIdAndUpdate(req.body.categoryId,findcategory);
      console.log("Blog data added successfully");
      return res.redirect("back");
    } else {
      console.log("Data not found");
      return res.redirect("back");
    }
  } catch (err) {
    console.error("Something went wrong:", err);
    return res.redirect("back");
  }
};

module.exports.viewBlog = async (req, res) => {

    let search = "";
    if (req.query.blogSearch) {
        search = req.query.blogSearch;
    }

    let per_page = 3;
    let page = 0;
    if (req.query.page) {
        page = req.query.page
    }
    let blogShow = await Blog.find({

        $or: [

            { titleName: { $regex: search } },

        ]
    }).skip(per_page * page).limit(per_page).populate("categoryId").exec();

    let totalCount = await Blog.find({
        $or: [

            { titleName: { $regex: search } },

        ]

    }).countDocuments();

    var totalPage = Math.ceil(totalCount / per_page);
    return res.render("Blog/viewBlog", {
        blogShow,
        search,
        totalPage,
        page
    })
}

module.exports.deleteblog = async (req, res) => {
    let id = req.params.id;
    let deleteRecord = await Blog.findById(id);
  
    const deletePath = path.join(__dirname, "..", deleteRecord.Blogimage);
    try {
        if (deletePath) {
            fs.unlinkSync(deletePath);
            console.log("Delete Record Successfully");
        }
    } catch (err) {
        console.log(err);
    }
    await Blog.findByIdAndDelete(id);
    return res.redirect('back');
  }

module.exports.updateBlog = async (req, res) => {
    try {
        id = req.params.id;
       
        let singBlog = await Blog.findById(id);
        const categoryData = await category.find();
        return res.render("Blog/updateBlog", {
            singBlog,
            categoryData
        })
    }
    catch {
        console.log("something is wrong");
        return res.redirect("back");
    }
}

module.exports.editBlog = async (req, res) => {
    console.log(req.body);
    
    console.log(req.file);
    if (req.file) {
  let singleData = await Blog.findById(req.body.id);
  console.log(singleData,"singale data");
  
     
      try{
          let imageOldpath = path.join(__dirname,'..',singleData.Blogimage);
          console.log(imageOldpath,"imageOldpath");
          fs.unlinkSync(imageOldpath)
          
  
      }
      catch(err){
          console.log("image is not found", err);
          
      }
      var newImagePath = Blog.imagePath+'/'+req.file.filename;
      req.body.Blogimage = newImagePath;

      await Blog.findByIdAndUpdate(req.body.id, req.body);
      return res.render('Blog/viewBlog');
  }
  else{
    let singleData = await Blog.findById(req.body.id);

      req.body.Blogimage = singleData.Blogimage;
    await Blog.findByIdAndUpdate(req.body.id,req.body);
    return res.redirect('/Blog/viewBlog');
  }

};
