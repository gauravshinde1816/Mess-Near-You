var mongoose = require("mongoose");
//writing the schema
var commentSchema = new mongoose.Schema({
    text: String,
    createdAt:{type : Date , default:Date.now},
    author : {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});
//modelling the schema
module.exports = mongoose.model("Comment" , commentSchema);

