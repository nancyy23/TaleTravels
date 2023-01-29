if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


// console.log(process.env.CLOUDINARY_SECRET);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Joi = require('joi');
const ejsmate = require('ejs-mate');
const session= require('express-session');
const flash = require('connect-flash');
var methodOverride = require('method-override');
const AppError = require('./utils/AppError');
const campgroundRoute = require('./routes/campground');
const reviewRoute = require('./routes/reviews');
const userRoute = require('./routes/user');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');


const mongoSanitize = require('express-mongo-sanitize');

const dburl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// dburl = process.env.DB_URL;

mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify :false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!");
});

const app = express();

app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('over'));
app.use(express.static(path.join(__dirname ,'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'secret';
const store = new MongoStore({
    mongoUrl:dburl,
    secret ,
    touchAfter: 24 * 60 *60
});

store.on('error',function(e){
    console.log('Session Error', e);
})

const sessionOptions = {
    store,
    name: 'sessionId',
    secret ,
    resave :false ,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires :Date.now() + 1000 * 60 * 60 * 24  *7,
        maxAge :1000 * 60 * 60 * 24  *7
    }
}
app.use(session(sessionOptions));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dg41kzklf/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    if(!['/login','/'].includes(req.session.originalUrl)){
        req.session.returnTo = req.session.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',userRoute);
app.use('/campground',campgroundRoute);
app.use('/campground/:id',reviewRoute);


app.get('/',(req,res)=>{
    res.render('home');
})



app.all('*',(req,res,next)=>{
    next(new AppError('Page Not Found',404));
})
app.use((err,req,res,next)=>{
    const {status = 500,message = 'Something went Wrong'} = err;
    res.status(status).render('error',{err});
})
const port = process.env.PORT ||3000;
app.listen(port,()=>{
    console.log(`serving on port ${port}`);
})