var mongoose = require("mongoose");
var campground=require("./models/campground");
var Comment= require("./models/comment");

data = [
    {
        name:"Daisy mountains",
        image:"https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=349&q=80",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name:"Lake",
        image:"https://images.unsplash.com/photo-1563074492-9e3ab8659b3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name:"Golden campfire",
        image:"https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    
]
 function seedDb(){
     campground.remove({}, function(err){
         if(err){
             console.log(err)
         }
         console.log("all the campgrounds has been removed");
         //adding new campground
         data.forEach(seed => {
            campground.create(seed ,function(err,campground){
                if(err){
                    console.log(err)
                }else{
                    console.log("adding the new campground");
                    //creating comments
                    Comment.create(
                        {
                            text:"this just a sample comments regarding",
                            author: "gaurav"
        
                        } , function(err, comment){
                            if(err){
                                console.log(err)
                            }else{
                                campground.comments.push(comment);
                                campground.save()
                                console.log("created the new comments");
                                
                            }
                        })
                }
            })
           
            
        });
      })
      
    };
 
 module.exports = seedDb;

 //adding the new campground

