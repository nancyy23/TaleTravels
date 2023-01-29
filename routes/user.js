
const express = require('express');
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const user = require('../controllers/user');

router.get('/register',user.renderRegisterForm);

router.post('/register',catchAsync(user.registerUser));

router.get('/login',user.renderLoginForm);

router.post('/login',passport.authenticate('local',{failureFlash: true , failureRedirect:'/login' }),user.loginUser);

router.get('/logout',user.logoutUser);

module.exports= router;


























// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const catchAsync = require('../utils/catchAsync');
// const User = require('../models/user');

// router.get('/register', (req, res) => {
//     res.render('users/register');
// });

// router.post('/register', catchAsync(async (req, res, next) => {
//     try {
//         const { email, username, password } = req.body;
//         const user = new User({ email, username });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             req.flash('success', 'Welcome to Yelp Camp!');
//             res.redirect('/campground');
//         })
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('/register');
//     }
// }));

// router.get('/login', (req, res) => {
//     res.render('users/login');
// })

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//     req.flash('success', 'welcome back!');
//     // const redirectUrl = req.session.returnTo || '/campground';
//     // delete req.session.returnTo;
//     res.redirect('/campground');
// })

// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', "Goodbye!");
//     res.redirect('/campground');
// })

// module.exports = router;