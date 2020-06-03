var express = require("express");
var campground = require("../models/campground");
var Router = express.Router();
var Comment =require("../models/comment");
// var middleware =require("../middlware");


var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);




// index : show the all campground
Router.get("/campgrounds",IsLoggedIn,function(req,res){
    
    //displaying all the data /campgrounds present in the database.
     campground.find({} , function(err , allcampground){
         if(err){
             console.log(err)
         }else{
            res.render("index" ,{campgrounds : allcampground});
         }
     })
    
    
    
});

//CREATE - add new campground to DB
Router.post("/campgrounds", IsLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    // geocoder.geocode(req.body.location, function (err, data) {
    //   if (err || !data.length) {
    //     req.flash('error', 'Invalid address');
    //     return res.redirect('back');
    //   }
    //   var lat = data[0].latitude;
    //   var lng = data[0].longitude;
    //   var location = data[0].formattedAddress;
      var newCampground = {name: name, image: image, description: desc, author:author};
      // Create a new campground and save to DB
      campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              //redirect back to campgrounds page
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });

  
  
  //New route : show form to create the new campground
Router.get("/campgrounds/new",IsLoggedIn ,function(req,res){
    res.render("new.ejs")
})
// show route : show the description about the campgrounds

Router.get("/campgrounds/:id" ,IsLoggedIn, function(req,res){
    //find the campground in the database with the help of id
    campground.findById(req.params.id).populate("comments").exec(function(err,newinfo){
        if(err){
            console.log(err)
        }else{
            //console.log(newinfo);
            res.render("show" ,{campground:newinfo});
        }
    })
    //rendering new page which shows more info about the campground.
   
});
//==EDIT ROUTES==//
Router.get("/campgrounds/:id/edit",Checkcampgroundownership, function(req,res){
    campground.findById(req.params.id,function(err,foundone){
        if(err){
            console.log(err);
        }else{
            res.render("edit",{campground:foundone});
        }
    })
})
   
//==UPDATE THE ROUTE==//
// UPDATE CAMPGROUND ROUTE
Router.put("/campgrounds/:id", Checkcampgroundownership, function(req, res){
    // geocoder.geocode(req.body.location, function (err, data) {
    //   if (err || !data.length) {
    //     req.flash('error', 'Invalid address');
    //     return res.redirect('back');
    //   }
    //   req.body.campground.lat = data[0].latitude;
    //   req.body.campground.lng = data[0].longitude;
    //   req.body.campground.location = data[0].formattedAddress;
  
      campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });

//==DESTROY THE CAMPGROUND==//
Router.delete("/campgrounds/:id" ,Checkcampgroundownership, function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            req.flash("success" ,"Mess has been removed successfully");
            res.redirect("/campgrounds")
        }
    })
});
//==check whether user is logged in or not==//
function IsLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please login");
    res.redirect("/login");
}
//==check campgroundpownership==//
function Checkcampgroundownership(req,res,next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id,function(err, foundone){
            if(err){
                res.redirect("back");
            }else{
                //Does user owns the campground
                if(foundone.author.id.equals(req.user._id)){
                    next();
                }else{
                   
                    res.redirect("back");
                }
                
            }
        })

    }else{
        req.flash("error" , "mess not find");
        res.redirect("back");
    }
}

 module.exports = Router;

