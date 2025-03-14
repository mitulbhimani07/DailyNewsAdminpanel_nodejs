const express = require("express");

const routes = express.Router();
const { check } = require('express-validator');



const categoryctl = require("../controllers/categoryCtl");

routes.get("/", categoryctl.addcategory);

routes.post("/insertCategory",[
    check('categoryname').notEmpty().withMessage("categoryname is required"),
], categoryctl.insertCategory);

routes.get("/viewcategory", categoryctl.viewcategory);

routes.post('/deleteMultipleCategory',categoryctl.deleteMultipleCategory)

routes.get('/categoryActive',categoryctl.categoryActive)

routes.get('/categoryActiveTrue',categoryctl.categoryActiveTrue)

routes.get('/deleteCategory/:id',categoryctl.deleteCategory);
// routes.get("/editcategory/:categoryid", categoryctl.editcategory);
// routes.post("/updateCategory", categoryctl.updateCategory);


module.exports = routes;