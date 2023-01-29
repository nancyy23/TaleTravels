const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Campground = require('../models/campground');
const {campSchema} = require('../schemas.js');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
// const campground = require('../models/campground');
const campgroundController = require('../controllers/campground');
const multer  = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({ storage })




router.get('/',catchAsync(campgroundController.index));

router.get('/new',isLoggedIn,campgroundController.renderNewForm );

router.post('/',isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.createCampground));
// router.post('/',upload.array('image') ,(req,res)=>{
//     console.log(req.body,req.files);
//     res.send('It worked');
// })

router.get('/:id',catchAsync(campgroundController.showCampground));

router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgroundController.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground , catchAsync(campgroundController.updateCampground));

router.delete('/:id',isLoggedIn,isAuthor ,catchAsync(campgroundController.deleteCampground));

module.exports = router;