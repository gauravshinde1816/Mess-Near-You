require('dotenv').config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var campground = require("./models/campground");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var seedDb = require("./seed");
var flash = require("connect-flash");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/User");
var methodOverride = require("method-override");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine" ,"ejs");
mongoose.connect("mongodb://localhost/yelpcamp_app");
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));
app.use(flash());

//==Refactoring the app.js==//
var campgroundRoutes = require("./Routes/campground");
var indexRoutes      = require("./Routes/indexroutes");
var commentRoutes    = require("./Routes/commentRoutes");
//===seeding the app.js====//
// seedDb();

//==EXPRESS SESSION==//
app.use(require("express-session")({
    secret:"this is my first trip to Germany",
    resave:false,
    saveUninitialized:false

}))


//==PASSPORT CONFIG==//
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

//==passing currentUser object to all templates==//
app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
    app.locals.moment = require('moment');
});

app.use(campgroundRoutes);
app.use(indexRoutes);
app.use(commentRoutes);



app.listen(3000 , function(){
    console.log("server has started");
});