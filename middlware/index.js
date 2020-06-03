var campground = require("../models/campground");
// var comment =require("../models/comment");
 var middlewareobj = {};
//==checking campground ownership==//
middlewareobj.Checkcampgroundownership = function(req,res,next){
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
        res.redirect("back");
    }
}
//==check the comment ownership==//
middlewareobj.Checkcommentownership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundcomment){
            //console.log(req.params.comment_id);
            if(err){
                res.redirect("back");
            }else{
                //Does user owns the campground
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
                
            }
        })

    }else{
        res.redirect("back");
    }
}

//==check whether user is logged in or not==//
middlewareobj.IsloggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareobj;