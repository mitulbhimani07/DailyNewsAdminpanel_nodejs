const express = require("express");

const routes = express.Router();


const blogModels = require('../models/blogModels')
const blogCtl = require("../controllers/blogControllers");
const { check } = require('express-validator');

routes.get("/", blogCtl.addBlog);

routes.post("/insertBlog",blogModels.uploadImageFile,[
    check('categoryId').notEmpty().withMessage("category is required"),
    check('titleName').notEmpty().withMessage("title Name is required"),
    check('aboutName').notEmpty().withMessage("Description is required"),
], blogCtl.insertBlog);

routes.get("/viewBlog", blogCtl.viewBlog);
routes.get('/deleteblog/:id',blogCtl.deleteblog);

routes.get("/updateBlog/:id", blogCtl.updateBlog);

routes.post("/editBlog",blogModels.uploadImageFile, blogCtl.editBlog)

module.exports = routes;