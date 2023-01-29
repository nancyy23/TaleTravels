const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../schemas.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const review = require('../controllers/review');



router.post('/review',validateReview, isLoggedIn, catchAsync(review.postReview));

router.delete('/review/:reviewId',isLoggedIn, isReviewAuthor,catchAsync(review.deleteReview));


module.exports = router;