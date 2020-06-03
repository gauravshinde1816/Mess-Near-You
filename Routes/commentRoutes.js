var express= require("express");
var Router = express.Router();
var Comment = require("../models/comment");
var campground = require("../models/campground");
// var middleware = require("../middlware/index");

// // ADDING THE NEW COMMENTS TO THE CAMPGROUND
Router.get("/campgrounds/:id/comments/new",IsLoggedIn ,function(req,res){
    //creating new comments
   campground.findById(req.params.id , function(err, campground){
       if(err){
           console.log(err)
       }else{
           res.render("comments" , {campground:campground})
       }
   })
   
    
})
//displaying new comments
Router.post("/campgrounds/:id/comments",IsLoggedIn, function(req,res){
   campground.findById(req.params.id, function(err , campground){
       if(err){
           req.flash("error" ,"campground not found");
           console.log(err);
       }else{
           Comment.create(req.body.comment , function(err,comment){
               if(err){
                   console.log(err)
               }else{
                    comment.author.id= req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    // console.log(comment);
                   campground.comments.push(comment);
                   campground.save()
                   //redirecting it to the show page
                   req.flash("success" ,"New comment has been added successfully.")
                  
                   res.redirect("/campgrounds/"+ req.params.id);
               }
           })
       }
   })
});
//==EDITING THE COMMENTS==//
Router.get("/campgrounds/:id/comments/:comment_id/edit",Checkcommentownership,function(req,res){    
   Comment.findById(req.params.comment_id,function(err, foundcomment){
       if(err){
           console.log(err);
        }
       else{
           res.render("editcomment",{campground_id:req.params.id,comment:foundcomment});
       }
   })
})
//==UPDATE THE COMMENT==//
Router.put("/campgrounds/:id/comments/:comment_id",Checkcommentownership, function(req,res){
    console.log(req.params.comment_id);    
    var _id = req.params.id.trim();
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedone){
        if(err){            
            res.redirect("back");
        }else{ 
            req.flash("success","comment is successfully updated");          
            res.redirect("/campgrounds/"+_id);
        }
    })
})
//==COMMENT DESTROY ROUTE==//
Router.delete("/campgrounds/:id/comments/:comment_id",Checkcommentownership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success" , "comment has been deleted successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
function Checkcommentownership(req,res,next){
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
        req.flash("error","please login");
        res.redirect("back");
    }
}
//==Isloggedin==//
function IsLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please login");
    res.redirect("/login");
}

 module.exports = Router;