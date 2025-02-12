const express = require('express');
const routes = express.Router()
const UserCtr = require('../controllers/userPanelController');
const commentModal =require('../models/commentModel')
const { check } = require('express-validator');
const passport = require('passport')




routes.get('/',UserCtr.home)
routes.get('/readMore/:id', UserCtr.readMore);
routes.post('/userPanel/insertComments', commentModal.uploadImageFile,
    [
    check('name').notEmpty().withMessage("first name is required").isLength({min : 2}).withMessage("Minimum 2 character is require"),
    check('email').notEmpty().withMessage("Email is require").isEmail().withMessage("Email is require").custom(
        async (value) =>{
            let checkEmail = await AdminModel.find({email:value}).countDocuments();
            if (checkEmail > 0) {
                throw new Error ('Admin email is already use')
            }
        }
    ),
    check('comments').notEmpty().withMessage("comment is required"),
    ], UserCtr.insertComments);
routes.get('/userRegister', async = (req,res)=>{
    return res.render('userPanel/userRegister')
})
routes.get('/userLogin', async = (req,res)=>{
    return res.render('userPanel/userLogin')
})
routes.post('/insertLogin',passport.authenticate('userAuth', { failureRedirect: '/userLogin',failureFlash:"user details not matched"}), UserCtr.insertLogin)
routes.post('/insertRegister', UserCtr.insertRegister)

routes.get('/userLike/:commentId',UserCtr.userLike)
routes.get('/userdislike/:commentId',UserCtr.userdislike)
module.exports = routes