const { query } = require("express");
const category = require("../models/categoryModel");
const { validationResult } = require('express-validator');




module.exports.addcategory = async (req, res) => {
    try {
        return res.render("category/addcategory",{
            oldData : [],
            errorData: []
        });
    }
    catch {
        console.log("something is wrong");
        return res.redirect("back");
    }
}

module.exports.insertCategory = async (req, res) => {
    try {
         const error = await validationResult(req);
            console.log(error);
            if (!error.isEmpty()) {
                return res.render('category/addcategory',{
                  errorData : error.mapped(),
                  oldData : req.body
                })
              }
        req.body.categorystatus = true;
        console.log(req.body);
        let categoryData = await category.create(req.body);
        
        if (categoryData) {
            req.flash('success','category add successfully')
            // console.log("category add successfully");
            return res.redirect("back")
        }
        else {
            req.flash('error','query is not perform')
            // console.log("");
            return res.redirect("back")
        }
    }
    catch {
        req.flash('error','something is wrong')
        // console.log("");
        return res.redirect("back")
    }
}
module.exports.viewcategory = async (req, res) => {


    let search = '';
    if (req.query.categorysearch) {
        search = req.query.categorysearch
    }

    let per_page = 5;
    let page = 0;
    if (req.query.page) {
        page = req.query.page
    }

    let categoryshow = await category.find({
        $or: [

            { categoryname: { $regex: search } }

        ]
    }).skip(per_page * page).limit(per_page);

    let totalcount = await category.find({
        $or: [

            { categoryname: { $regex: search } }

        ]

    }).countDocuments();
    
    var no = (page==0)?0:(page*per_page);
    var totalpage = Math.ceil(totalcount / per_page);
    return res.render("category/viewcategory", {
        categoryshow,
        search,
        totalpage,
        page,
        no
    })

}
module.exports.deleteMultipleCategory = async (req,res)=>{
    try{
        console.log(req.body);
        let CategoryDelete = await category.deleteMany({_id:{$in:req.body.Ids}});
        if (CategoryDelete) {
            req.flash('success','Delete is successfully')

            return res.redirect("back")
        }
        else{
            req.flash('error','something is wrong')
            return res.redirect("back")

        }
    }
    catch {
        req.flash('error','something is wrong')
        return res.redirect("back")
    }
}
module.exports.categoryActive = async (req,res) =>{
    try{
        console.log(req.query);
        let categorystatus = await category.findByIdAndUpdate(req.query.categoyIds ,{categorystatus : false})
        if (categorystatus) {
            req.flash('success','category Deactive successfully')
            return res.redirect("back")
        }
        else{
            req.flash('error','something is wrong for Active')
            return res.redirect("back")
        }
    }catch{
        req.flash('error','something is wrong')
        return res.redirect("back")
    }
}
module.exports.categoryActiveTrue = async (req,res) =>{
    try{
        console.log(req.query);
        let categorystatus = await category.findByIdAndUpdate(req.query.categoyIds ,{categorystatus : true})
        if (categorystatus) {
            req.flash('success','category Active successfully')
            return res.redirect("back")
        }
        else{
            req.flash('error','something is wrong for Deactive')
            // console.log("something is wrong");
            return res.redirect("back")
        }
    }catch{
        req.flash('error','something is wrong')
        return res.redirect("back")
    }
}

module.exports.deleteCategory = async (req, res) => {
    try{
      await category.findByIdAndDelete( req.params.id);
      req.flash('error',"Category delete successfully");
      return res.redirect("back");
    }
    catch(err){
      console.log(err);
      return res.redirect('back');  
    }
  };
  
//   module.exports.editcategory = async (req, res) => {
//       try {
//           let categoryid = req.params.categoryid;  // Use req.params instead of req.query
//           let categoryData = await category.findById(categoryid);
//           return res.render("category/updeteCategory", {
//               categoryData
//           });
//       } catch {
//           console.log("Something went wrong");
//           return res.redirect("back");
//       }
//   };
//   module.exports.updateCategory = async (req, res) => {
//     console.log(req.body);
    
//     try {
//         let categoryData = await category.findByIdAndUpdate(req.body.id, req.body);
//         if (categoryData) {
//             console.log("Category updated successfully");
//             return res.redirect("/category/viewcategory");
//         } else {
//             console.log("Update query failed");
//             return res.redirect("back");
//         }
//     } catch {
//         console.log("Something went wrong");
//         return res.redirect("back");
//     }
// };


