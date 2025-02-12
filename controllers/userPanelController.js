const categoryModel = require('../models/categoryModel')
const Blogs = require('../models/blogModels')
const CommentsModel = require('../models/commentModel')
const UserModel = require('../models/userModel')
const { validationResult } = require('express-validator');

module.exports.home = async (req, res) => {
  try {
    const categoryUserData = await categoryModel.find();
    const blogFilter = { blogStatus: true };

    // Apply category filter
    if (req.query.catId) {
      blogFilter.categoryId = req.query.catId;
    }

    // Apply search filter
    if (req.query.search) {
      blogFilter.titleName = { $regex: req.query.search, $options: "i" }; // Case-insensitive search
    }

    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = 8; // Blogs per page
    const skip = (page - 1) * limit;

    const totalBlogs = await Blogs.countDocuments(blogFilter);
    const totalPages = Math.ceil(totalBlogs / limit);

    const BloguserData = await Blogs.find(blogFilter)
      .skip(skip)
      .limit(limit);

    return res.render("userPanel/home", {
      BloguserData,
      categoryUserData,
      currentPage: page,
      totalPages,
      searchQuery: req.query.search || ""
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.redirect("back");
  }
};

module.exports.readMore = async (req, res) => {
  try {
    const search = req.query.search || '';
    let postId = req.params.id;
    let viewCommentsActive = await CommentsModel.find({ blogStatus: true })
    let postWiseComments = await CommentsModel.find({ postId: postId, blogStatus: true })
    let viewComments = await CommentsModel.find({ Status: true ,postId : postId});

    const UserDetails = await Blogs.findById(postId);

    let allCategory = await categoryModel.find({ categoryStatus: true })
    const allBlogs = await Blogs.find({
      blogStatus: true,
      $or: [
        { titleName: { $regex: search, $options: 'i' } },
      ]
    })
      .sort({ _id: -1 })
      .limit(5);

    return res.render('userPanel/readMore', {
      UserDetails,
      allBlogs,
      allCategory,
      postId,
      search,
      viewCommentsActive,
      viewComments,
      postWiseComments,
      errorData: [],
      oldData: []
    });
  } catch (err) {
    console.error('Error fetching blog details:', err);
    return res.redirect('back');
  }
};
module.exports.insertComments = async (req, res) => {
  try {
    const error = await validationResult(req);
    console.log(error);

    // if (!error.isEmpty()) {
    //   return res.render('userPanel/readMore',{
    //     errorData : error.mapped(),
    //     oldData : req.body,
    //     UserDetails
    //   })
    // }
    console.log(req.body)
    console.log(req.file)

    let image = "";
    if (req.file) {
      image = CommentsModel.imgPath + "/" + req.file.filename;
    }
    req.body.image = image;

    let addComments = await CommentsModel.create(req.body);
    if (addComments) {

      let blogDetails = await Blogs.findById(req.body.postId);
      blogDetails.commentId.push(addComments._id);
      await Blogs.findByIdAndUpdate(req.body.postId, blogDetails);

      req.flash("success", "data added Successfully...", { blogDetails });
      return res.redirect('back')
    }
    else {
      console.error('Error fetching blog details:', err);
      return res.redirect('back');
    }
  }
  catch (err) {
    console.error('Error fetching blog details:', err);
    return res.redirect('back');
  }
}
module.exports.viewComments = async (req, res) => {
  try {
    // Fetch active comments from the database
    let viewCommentsActive = await CommentsModel.find({ Status: true });

    // Render the comments in the EJS template
    return res.render('userPanel/viewComments', { viewCommentsActive });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return res.redirect('back');
  }
};
module.exports.insertLogin = async (req, res) => {
  try {
    console.log("user login successfully");
    return res.redirect("/");
  }
  catch (err) {
    console.log(err);
    res.redirect('back')
  }
}
module.exports.insertRegister = async (req, res) => {
  console.log(req.body);
  try {
    if(req.body.password==req.body.cPassword){
      let userData=await UserModel.create(req.body);
      if(userData){
        console.log("user register successfully");
        return res.redirect('back');
      }
      else{
        console.log("user not add");
        return res.redirect('back');
      }
    }else{
      console.log("password and confirm password not matched");
      res.redirect('back');
    }
  }
  catch (err) {
    console.log(err);
    res.redirect('back')
  }
}
module.exports.userLike = async (req, res) => {
  try {
    console.log(req.user);

    console.log(req.params)
    let singleComment = await CommentsModel.findById(req.params.commentId);
    if (singleComment) {
      let likeuserAlreadyexist = singleComment.like.includes(req.user._id)
      if (likeuserAlreadyexist) {
        let newData = singleComment.like.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        })
        singleComment.like = newData
      }
      else {
        console.log(req.user._id);
        singleComment.like.push(req.user._id);
        console.log(singleComment);
      }
      let disklikesUserAlreadyExist=singleComment.dislike.includes(req.user._id);

      if(disklikesUserAlreadyExist){
        let newData = singleComment.dislike.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        })
        singleComment.dislike=newData;
      }

    }
    let storage = await CommentsModel.findByIdAndUpdate(req.params.commentId, singleComment);
    console.log(storage);
    
     return res.redirect('back')
  }
  catch (err) {
    console.log(err);
    res.redirect('back')
  }
}
module.exports.userdislike = async (req, res) => {
  try {
    console.log(req.user);

    console.log(req.params)
    let singleComment = await CommentsModel.findById(req.params.commentId);
    if (singleComment) {
      let dislikeuserAlreadyexist = singleComment.dislike.includes(req.user._id)
      if (dislikeuserAlreadyexist) {
        let newData = singleComment.dislike.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        })
        singleComment.dislike = newData
      }
      else {
        console.log(req.user._id);
        singleComment.dislike.push(req.user._id);
        console.log(singleComment);
      }
      let disklikesUserAlreadyExist=singleComment.like.includes(req.user._id);
      if(disklikesUserAlreadyExist){
        let newData = singleComment.like.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        })
        singleComment.like=newData;
      }
    }
    let storage = await CommentsModel.findByIdAndUpdate(req.params.commentId, singleComment);
    console.log(storage);
    
     return res.redirect('back')
  }
  catch (err) {
    console.log(err);
    res.redirect('back')
  }
}