const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder =  mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
    const campground = await Campground.find({});
    res.render('campground/index', { campground})
}

module.exports.renderNewForm = (req, res) => {
    res.render('campground/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData =await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit: 1
    }).send()
    // console.log(geoData.body.features[0].geometry.coordinates);
    // res.send('ok');
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campground/${camp._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground');
    }
    res.render('campground/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campground');
    }
    res.render('campground/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.image.push(...imgs);
    await camp.save();
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campground/${camp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campground');
}














// // const campground = require('../models/campground');
// const Campground = require('../models/campground');
// const {cloudinary} = require('../cloudinary');

// module.exports.index = async (req,res,next)=>{
//     const campground = await Campground.find({});
//     res.render('campground/index',{campground});
// }

// module.exports.renderNewForm =(req,res)=>{
//     res.render('campground/new');
// }

// module.exports.createCampground  = async (req,res,next)=>{
//     const camp = new Campground(req.body.campground);
//     camp.image = req.files.map(f=>({url: f.path, filename: f.filename}));
//     camp.author = req.user._id;
//     await camp.save();
//     console.log(req.files);
//     req.flash('success','Campground created Successfully');
//     res.redirect(`/campground/${camp._id}`);
// }

// module.exports.showCampground = async (req,res,next)=>{
//     const campground = await Campground.findById(req.params.id).populate({
//         path: 'reviews',
//         populate:{
//             path:'author'
//         }
//     }).populate('author');
//     if(!campground){
//         req.flash('error','No Campground found');
//         return res.redirect('/campground');
//     }
//     res.render('campground/show',{campground});
// }

// module.exports.renderEditForm = async (req,res,next)=>{
//     const campground = await Campground.findById(req.params.id);
//     res.render('campground/edit',{campground});
// }

// module.exports.updateCampground = async (req,res,next)=>{
//     const {id} = req.params;
//     const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
//     const image = req.files.map(f=>({url: f.path, filename: f.filename}));
//     camp.image.push(...image);
//     await camp.save();
//     if(req.body.deleteImage){
//         await camp.update({$pull: {image: {filename: { $in: req.body.deleteImage}}}})
//         console.log(camp);
//     }
//     req.flash('success','Campground updated Successfully');
//     res.redirect(`/campground/${camp._id}`);
// }

// // module.exports.updateCampground = async (req, res) => {
// //     const { id } = req.params;
// //     console.log(req.body);
// //     const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
// //     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
// //     camp.image.push(...imgs);
// //     await camp.save();
// //     if (req.body.deleteImage) {
// //         for (let filename of req.body.deleteImage) {
// //             await cloudinary.uploader.destroy(filename);
// //         }
// //         await camp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } })
// //         await camp.save();
// //     }
// //     req.flash('success', 'Successfully updated campground!');
// //     res.redirect(`/campground/${camp._id}`)
// // }

// module.exports.deleteCampground = async (req,res,next)=>{
//     const {id} = req.params;
//     const camp = await Campground.findByIdAndDelete(id);
//     req.flash('success','Campground deleted Successfully');
//     res.redirect('/campground');
// }