var mongoose = require("mongoose");
//Writing of Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    price:String,
    image: String,
    description: String,
    lacation:String,
    lat:Number,
    lng:Number,
    createdAt:{type: Date, default:Date.now},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"},
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})
//model the schema
 module.exports= mongoose.model("campground" ,campgroundSchema);