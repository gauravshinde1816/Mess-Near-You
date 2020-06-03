var express = require("express");
var Router =  express.Router();
var User = require("../models/User");
var passport = require("passport");
var campground = require("../models/campground");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
const xoauth2 = require('xoauth2');
// var middleware = require("../middlware/index");

//==LANDING PAGE==//
Router.get("/",function(req,res){
    res.render("landing")
});

//[==AUTHENTICATION ROUTES==]//

//SIGN FORM
Router.get("/register",function(req,res){
    res.render("register");

});
//LOGIC FOR SIGN UP PAGE
//handle sign up logic
Router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username,
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            Email:req.body.Email,
                            avatar:req.body.avatar});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});
//==LOGIN FORM==//
Router.get("/login", function(req,res){
    
    res.render("login");

});
//==LOGIN LOGIC PAGE==//
Router.post("/login",passport.authenticate("local" ,{
    //req.flash("error","successfully logged In"),
    successRedirect:"/campgrounds",
    
     failureRedirect:"/login"
}), function(req,res){
    
});
//==LOGOUT LOGIC==//
Router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","successfully logged out");
    res.redirect("/");
})

//==IsloggedIn==//
function IsLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please login");
    res.redirect("/login");
}


// forgot password
Router.get('/forgot', function(req, res) {
    res.render('forgot');
  });
  
  Router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ Email: req.body.Email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      //Set up npdemailer//
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'learntocodeinfo@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.Email,
          from: 'learntocodeinfo@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.Email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  Router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  Router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'learntocodeinfo@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.Email,
          from: 'learntocodeinfo@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.Email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/campgrounds');
    });
  })


//==User profile==//
Router.get("/user/:id" ,function(req,res){
    // res.send("all users goes here");
    User.findById(req.params.id,function(err,foundone){
        if(err){
            req.flash("error","somthing went wrong");
            res.redirect("back");
        }else{
            campground.find().where("author.id").equals(foundone._id).exec(function(err ,campgrounds){
                if(err){
                    req.flash("error","somthing went wrong");
                    res.redirect("back");
                }
                else{
                    res.render("user",{user:foundone,campgrounds:campgrounds});
                }
            })
           
        }
    })
});
module.exports= Router;
