const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.postReview = async(req,res)=>{
    // res.send('okk');
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author= req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Review created Successfully');
    res.redirect(`/campground/${campground._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews :reviewId}});
    req.flash('success','Review deleted Successfully');
    res.redirect(`/campground/${id}`);
}