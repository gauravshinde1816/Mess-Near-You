var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
 userSchema = new mongoose.Schema({
     username:{type:String,unique:true,required:true},
     password:String,
     avatar:String,
     firstName:String,
     lastName:String,
     Email:{type:String,unique:true,required:true},
     resetPasswordToken:String,
     resetPasswordExpires:Date


 })
userSchema.plugin(passportLocalMongoose);
 module.exports = mongoose.model("User" , userSchema);
