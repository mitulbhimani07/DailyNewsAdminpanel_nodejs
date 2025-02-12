const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AdminModel = require('../models/AdminModel')
const UserModel = require('../models/userModel')


passport.use(new LocalStrategy({
    usernameField: 'email',
}, async function (email, password, done) {
    let adminData = await AdminModel.findOne({ email: email });
    if (adminData) {
        if (adminData.password == password) {
            return done(null, adminData)
        }
        else {
            return done(null, false)
        }
    }
    else {
        return done(null, false)
    }
}));

passport.use("userAuth",new LocalStrategy({
    usernameField: 'email',
}, async function (email, password, done) {
    let userData = await UserModel.findOne({ email: email });
    if (userData) {
        if (userData.password == password) {
            return done(null, userData)
        }
        else {
            return done(null, false)
        }
    }
    else {
        return done(null, false)
    }
}));


passport.serializeUser(function (user, done) {
    return done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
    let AdminRecord = await AdminModel.findById(id);
    if (AdminRecord) {
        return done(null, AdminRecord)
    }
    else {
        const userData=await UserModel.findById(id);
        if(userData){
            return done(null,userData);
        }
        else{
            return done(null,false);
        }
    }
});


passport.setAuthUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    next();
}

passport.checkAuthUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        return res.redirect('/signIn');
    }
}


module.exports = passport;