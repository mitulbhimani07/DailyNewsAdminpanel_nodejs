const AdminModel = require("../models/AdminModel");
const CategoryModel = require("../models/categoryModel");
const BlogModel = require("../models/blogModels");
const CommentsModel = require('../models/commentModel')
const path = require('path');
const fs = require('fs');
const { name } = require("ejs");
const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer");

module.exports.dashboard = async (req, res) => {
  try {
    // Category chart
    let categoryData = await CategoryModel.find();
    let dataCat = [];
    let labelCat = [];
    let totalBlogs = 0; 
    let totalCategories = categoryData.length; 

    categoryData.map((v) => {
      const blogCount = v.blogid.length;
      dataCat.push(blogCount);
      labelCat.push(v.categoryname);
      totalBlogs += blogCount; 
    });

    // Blog chart
    let blogData = await BlogModel.find({ blogStatus: true });
    let dataBlog = [];
    blogData.map((v) => {
      dataBlog.push(v.categoryId.length);
    });
    // / **Fetch total comments count**
    let totalComments = await CommentsModel.countDocuments({ Status: true }); 


    res.render("dashboard", {
      categoryData,
      labelCat,
      dataCat,
      dataBlog,
      totalBlogs,      
      totalCategories,
      totalComments 
    });
  } catch (err) {
    console.log(err);
    return res.redirect("err");
  }
};
module.exports.dashboard2 = (req, res) => {
  try {
    res.render("dashboard2");
  } catch (err) {
    console.log(err);
    return res.redirect("err");
  }
};
module.exports.dashboard3 = (req, res) => {
  try {
    res.render("dashboard3");
  } catch (err) {
    console.log(err);
    return res.redirect("err");
  }
};
module.exports.AddAdmin = (req, res) => {
  try {
    res.render("AddAdmin",{
      errorData : [],
      oldData : []
    });
  } catch (err) {
    console.log(err);
    return res.redirect("err");
  }
};
module.exports.insertAdmin = async (req, res) => {
  try {
    const error = await validationResult(req);
    console.log(error);
    if (!error.isEmpty()) {
      return res.render('AddAdmin',{
        errorData : error.mapped(),
        oldData : req.body
      })
    }
    
    console.log(req.body);
    console.log(req.file);
    let adminImage = "";
    if (req.file) {
      adminImage = AdminModel.imagePath + "/" + req.file.filename;
    }
    req.body.image = adminImage;
    req.body.name = req.body.fname + " " + req.body.lname;

    const AdminRecord = await AdminModel.create(req.body);
    if (AdminRecord) {
      req.flash('success','Data added Successfully')
      // console.log("");
      return res.redirect("/ViewAdmin");
    } else {
      req.flash('error','Something is Wrong...')
      // console.log("");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
module.exports.ViewAdmin = async (req, res) => {
  try {
    let { search, page } = req.query;
    let perPage = 5; // Number of records per page
    let currentPage = parseInt(page) || 1;
    let query = {};

    // Search by name or email
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
    }

    let totalRecords = await AdminModel.countDocuments(query);
    let totalPages = Math.ceil(totalRecords / perPage);

    let AdminRecord = await AdminModel.find(query)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.render('ViewAdmin', {
      AdminRecord,
      search,
      totalPages,
      currentPage
    });

  } catch (err) {
    req.flash('error', 'Something is Wrong...');
    console.log(err);
    return res.redirect('back');
  }
};

module.exports.deleteAdmin = async (req, res) => {
  let id = req.params.id;
  let deleteRecord = await AdminModel.findById(id);

  const deletePath = path.join(__dirname, "..", deleteRecord.image);
  try {
      if (deletePath) {
          fs.unlinkSync(deletePath);
          console.log("Delete Record Successfully");
      }
  } catch (err) {
      console.log(err);
  }
  await AdminModel.findByIdAndDelete(id);
  return res.redirect('back');
}
module.exports.updateAdmin = async (req, res) => {
  try {
    let SingleObj = await AdminModel.findById(req.params.id);
    res.render('editAdmin', {
      SingleObj,
      name
    });
    req.flash('success','Data added Successfully')
  } catch (err) {
    req.flash('error','Something is Wrong...')
    // console.log(err, "Something is wrong");
    return res.redirect('back');
  }
}
module.exports.editAdmin = async (req, res) => {
  console.log(req.body);
  
  console.log(req.file);
  let singleData = await AdminModel.findById(req.body.id);
  console.log(singleData);
  
  if (req.file) {
     
      let imageOldpath = path.join(__dirname,'..',singleData.image);
      // console.log(imageOldpath,"imageOldpath");
      
      try{
         await fs.unlinkSync(imageOldpath)
  
      }
      catch(err){
          console.log("image is not found", err);
          
      }
      var newImagePath = AdminModel.imagePath+'/'+req.file.filename;
      req.body.image = newImagePath;

      await AdminModel.findByIdAndUpdate(req.body.id, req.body);
      return res.redirect('/ViewAdmin');
  }
  else{
      req.body.image = singleData.image;
    await AdminModel.findByIdAndUpdate(req.body.id,req.body);
    return res.redirect('/');
  }

}

//Sign In

module.exports.signIn = async (req, res) => {
  try {
    return res.render('signIn');
  }
  catch (err) {
    console.log(err);
    return res.redirect('back');
  }
}
module.exports.checkSignIn = async (req, res) => {
  try {
    req.flash('success','Login Successfully')
    return res.redirect("/dashboard");
  }
  catch (err) {
    console.log(err);
    res.redirect("back");
  }
};
module.exports.myProfile = (req, res) => {

  try {
    return res.render("myProfile")
  }
  catch (err) {
    console.log(err);
    return res.redirect("back");
  }
}
// logout 
module.exports.signOut = (req, res) => {
  try {

    req.session.destroy(function (err) {
      if (err) {
        return false;
      }
      return res.redirect('/signIn')
    })


  }
  catch (err) {
    console.log(err);
    return res.redirect("back");
  }
}
module.exports.changePassword = async (req, res) => {
  try {
    res.render('ChangePassword');
  } catch (err) {
    console.log(err);
    return res.redirect('back');
  }
}
module.exports.changeNewPassword = async (req, res) => {
  try {
    let oldPassword=res.locals.user;
    console.log(oldPassword);
    if(oldPassword.password==req.body.currentPassword){
      if(req.body.currentPassword!=req.body.newPassword){
        if(req.body.newPassword==req.body.confirmPassword){
          let editPassword=await AdminModel.findByIdAndUpdate(oldPassword._id,{password:req.body.newPassword});
          req.flash('success',"Password Changed successfully");
          return res.redirect('/signOut');
        }else{
          console.log("New password and Confirm password are doesn't match.Try Again..");
          res.redirect('back');
        }
      }else{
        console.log("Current Password and new password are same.Try another..");
        res.redirect('back');
      }
    }else{
      console.log("current password is doesn't match with old pssword.Try Again..");
      res.redirect('back');
    }
  }catch(err){
    req.flash('error',"Something is wrong");
    console.log("error",err);
    return res.redirect('back');
  }
}

//forget password
module.exports.verifyemailpass = async(req,res)=>{
  try{
      res.render('verifyEmail');
      
  }
  catch(err){
      console.log(err);
      
  }
}
module.exports.verifyEmail = async (req, res) => {
  console.log(req.body);
  try {
    
    let singleObj=await AdminModel.find({email:req.body.email}).countDocuments();
    if(singleObj==1){
      let singleAdminData=await AdminModel.findOne({email:req.body.email});
      console.log(singleAdminData);
      let OTP=Math.floor(Math.random()*100000);
      res.cookie('otp',OTP);
      res.cookie('email',singleAdminData.email);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: "mitulbhimani281@gmail.com",
          pass: "qbvhmsobzletiapn",
        },
        tls:{
          rejectUnauthorized:false
        }
      });

      const info = await transporter.sendMail({
        from: "mitulbhimani281@gmail.com", 
        to: singleAdminData.email,
        subject: "OTP ", 
        text: "verify OTP",
        html: `<b>your OTP is ${ OTP}</b>`, 
      });
    
      console.log("Message sent: ");

      req.flash('warning',"OTP sent successfully");
      return res.redirect('checkOtp');
    }
    else{
      console.log("invalid email");
      req.flash('error',"Invalid  Email");
      return res.redirect('back');
    }
  }catch(err){
    console.log(err);
    return res.redirect('back');
  }
}

module.exports.checkOtp = async (req, res) => {
  try {
    return res.render('otp');
  }
  catch (err) {
    console.log(err);
    return res.redirect('back');
  }
}
module.exports.verifyOtp = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.cookies.otp);
    if (req.body.otp = req.cookies.otp) {
      res.clearCookie('otp');
      req.flash('success','veriFyOtp succsesfully')
      res.redirect('/forgotPass');
    }
    else {
        req.flash('error', 'An error occurred');

      console.log("Invalid OTP");
      res.redirect('back');
    }
  }
  catch (err) {
    console.log(err);
    return res.redirect('back');
  }
}

module.exports.forgotPass = async (req, res) => {
  try {
    return res.render('forgotPass');
  }
  catch (err) {
    console.log(err);
    return res.redirect('back');
  }
}

module.exports.verifyPass = async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.newPassword == req.body.confirmPassword) {
      let checkLastTime = await AdminModel.find({ email: req.cookies.email }).countDocuments();
      if (checkLastTime == 1) {
        let adminDataNew = await AdminModel.findOne({ email: req.cookies.email });
        let updatePass = await AdminModel.findByIdAndUpdate(adminDataNew._id, { password: req.body.newPassword });
        if (updatePass) {
          res.clearCookie('email');
          req.flash('success', 'Password changed successfully');
          return res.redirect('/signIn');
        }
        else {
          req.flash('error', 'Password not Updated..Try again');
          return res.redirect('back');
        }
      }
      else {
        req.flash('error', 'Email not found..Try again');
        return res.redirect('back');
      }
    }
    else {
      req.flash('error', 'new Password and confirm password not matched..Try again');
      return res.redirect('back');
    }

  }
  catch (err) {
    req.flash('error', 'An error occurred');
    console.log(err);
    return res.redirect('back');
  }
}

module.exports.deleteMultipleAddmin = async(req,res)=>{
  try{
    console.log(req.body);
    let CategoryDelete = await AdminModel.deleteMany({_id:{$in:req.body.Ids}});
    if (CategoryDelete) {
      req.flash('success', 'Admins deleted successfully');
      return res.redirect("back")
    }
    else{
      req.flash('error', 'Something went wrong while deleting');
      // console.log("something is wrong");
      return res.redirect("back")
      
    }
  }
  catch {
    req.flash('error', 'An error occurred');
    return res.redirect("back")
  }
}
  // module.exports.insertCategory = async (req, res) => {
  //   try {
  //     console.log(req.body);
  
  //     //   console.log(req.file);
  //     //   let adminImage = "";
  //     //   if (req.file) {
  //     //     adminImage = AdminModel.imgPath + "/" + req.file.filename;
  //     //   }
  //     //   req.body.image = adminImage;
  //     //   req.body.name = req.body.fname + " " + req.body.lname;
  
  //     //   const AdminRecord = await AdminModel.create(req.body);
  //     //   if (AdminRecord) {
  //     //     console.log("Data added Successfully");
  //     //     return res.redirect("/ViewAdmin");
  //     //   } else {
  //     //     console.log("Something is Wrong...");
  //     //     return res.redirect("back");
  //     //   }
  //   } catch (err) {
  //     console.log(err);
  //     return res.redirect("back");
  //   }
  // }