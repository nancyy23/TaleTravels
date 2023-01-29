const User = require('../models/user')
const passport = require('passport');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register');
}

module.exports.registerUser = async (req,res,next)=>{
    try{
        const {username,password,email} = req.body;
        const user = new User({username,email})
        const newUser = await User.register(user,password);
        req.login(newUser,err=>{
            if(err) return next(err);
            req.flash('success','Registerd Successfully');
            res.redirect('/campground');
        })
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }

}
module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login');
}

module.exports.loginUser = (req,res)=>{
    req.flash('success','Welcome Back!!!');
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res)=>{
    req.logout();
    req.flash('success','Logged Out Successfully');
    res.redirect('/campground');
}