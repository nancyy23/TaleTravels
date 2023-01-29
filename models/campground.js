const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const User = require('./user');

const ImageSchema = new Schema({
    url:String,
    filename:String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','upload/w_200');
});

const opts = {toJSON :{virtuals :true}};

const CampgroundSchema = new Schema({
    title: String,
    image: [ImageSchema],
    description: String,
    price: Number,
    location:String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author:{
        type:Schema.Types.ObjectId,
        ref :'User'
    },
    reviews:[
        {
           type : Schema.Types.ObjectId,
           ref : 'Review'
        }]
},opts)

CampgroundSchema.virtual('properties.popUp').get(function(){
        return `<a href="/campground/${this._id}">${this.title}</a>`;
})

CampgroundSchema.post('findOneAndDelete',async(camp)=>{
    if(camp){
        await Review.deleteMany({_id :{ $in: camp.reviews}})
        
    }
})

module.exports=mongoose.model('Campground',CampgroundSchema);