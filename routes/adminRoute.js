const express = require('express');
const routes = express.Router();
const adminCtrl = require('../controllers/adminController');
const AdminModel = require('../models/AdminModel');
const passport = require('passport')
const UserCtr = require('../controllers/userPanelController');
const { check } = require('express-validator');

// LOGIN
routes.get('/signIn', adminCtrl.signIn);
routes.post('/checkSignIn', passport.authenticate('local', { failureRedirect: '/signIn' }), adminCtrl.checkSignIn);

routes.get("/myProfile", passport.checkAuthUser, adminCtrl.myProfile);
routes.get("/signOut", adminCtrl.signOut);

//ChangePassword
routes.get('/ChangePassword',passport.checkAuthUser,adminCtrl.changePassword)
routes.post('/changeNewPassword',passport.checkAuthUser,adminCtrl.changeNewPassword)


routes.get('/dashboard', passport.checkAuthUser, adminCtrl.dashboard);
routes.get('/dashboard2', passport.checkAuthUser, adminCtrl.dashboard2);
routes.get('/dashboard3', passport.checkAuthUser, adminCtrl.dashboard3);
routes.get('/AddAdmin', passport.checkAuthUser, adminCtrl.AddAdmin);
routes.post('/insertAdmin', AdminModel.uploadImageFile, [
    check('fname').notEmpty().withMessage("first name is required").isLength({min : 2}).withMessage("Minimum 2 character is require"),
    check('lname').notEmpty().withMessage("Last name is required").isLength({min : 2}).withMessage("Minimum 2 character is require"),
    check('email').notEmpty().withMessage("Email is require").isEmail().withMessage("Email is require").custom(
        async (value) =>{
            let checkEmail = await AdminModel.find({email:value}).countDocuments();
            if (checkEmail > 0) {
                throw new Error ('Admin email is already use')
            }
        }
    ),
    check('password')
  .notEmpty().withMessage('Password is required')
  .isLength({ min: 8 }).withMessage('Please enter a password at least 8 characters')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[0-9a-zA-Z@$!%*?&]{8,}$/, "i")
  .withMessage('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'),

    check('gender').notEmpty().withMessage("Gender is required"),
    check('hobby').notEmpty().withMessage("Hobby is required"),
    check('city').notEmpty().withMessage("city is required"),
    check('message').notEmpty().withMessage("Message is required"),

] , adminCtrl.insertAdmin);
routes.get('/ViewAdmin',  passport.checkAuthUser,adminCtrl.ViewAdmin);

routes.get('/deleteAdmin/:id', adminCtrl.deleteAdmin);
routes.get('/updateAdmin/:id', adminCtrl.updateAdmin);
routes.post('/editAdmin', AdminModel.uploadImageFile, adminCtrl.editAdmin);
routes.get('/userPanel/viewComments',AdminModel.uploadImageFile, UserCtr.viewComments);

routes.get('/checkEmail', passport.checkAuthUser, (req, res) => {
    return res.render('checkEmail');
})


routes.get('/verifyemailpass' , adminCtrl.verifyemailpass);
routes.post('/verifyEmail' , adminCtrl.verifyEmail);
routes.get('/checkOtp' , adminCtrl.checkOtp);
routes.post('/verifyOtp' , adminCtrl.verifyOtp);
routes.get('/forgotPass' , adminCtrl.forgotPass);
routes.post('/verifyPass' , adminCtrl.verifyPass);
routes.post('/deleteMultipleAddmin' ,adminCtrl.deleteMultipleAddmin)


// routes.post('/insertCategory', AdminModel.uploadImageFile, adminCtrl.insertCategory);
routes.use('/', require('./userPanelRoutes'))
module.exports = routes;