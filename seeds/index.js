const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedhelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!");
});

const sample = array=>array[Math.floor(Math.random()*array.length)];

const seedDb = async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*100);
        const camp = new Campground({
            author:'627cb4561f0a4f287f299714',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title :`${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type:'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            image : [
                {
                    url: 'https://res.cloudinary.com/dg41kzklf/image/upload/v1674643035/YelpCamp/sxn6ndbyy2e1wuo0jx9i.jpg',
                    filename: 'YelpCamp/sxn6ndbyy2e1wuo0jx9i'
                },
                {
                    url: 'https://res.cloudinary.com/dg41kzklf/image/upload/v1674643035/YelpCamp/sxn6ndbyy2e1wuo0jx9i.jpg',
                    filename: 'YelpCamp/sxn6ndbyy2e1wuo0jx9i'
                }
            ],
            price: price,
            description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima necessitatibus eligendi possimus illum mollitia nam numquam? Non velit, in doloribus nulla quidem alias omnis a veniam ratione iusto vero. Ex.'
        })
        await camp.save();
    }
    
}
seedDb().then(()=>{
    mongoose.connection.close();
})