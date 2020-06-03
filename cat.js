var mongoose =require("mongoose");
mongoose.connect("mongodb://localhost/cat1_app");

var catSchema = new mongoose.Schema({
    name: String,
    age: Number
});

var Cat = mongoose.model("Cat", catSchema)

// // adding new cat to the database

// var george= new Cat({
//     name:"billu",
//     age:4

// });

// george.save(function(err,cat){
//     if(err){
//         console.log("something went wrong");
//     } else{
//         console.log("we have added new cat to the database")
//         console.log(cat)
//     }
// })

//adding new cat to the database

Cat.create({
    name: "Mrs. lorris",
    age: 14,

} , function(err,cat){
    if(err){
        console.log("somthing went wrong")    }
        else{
            console.log("we have added new cat to the database");
            console.log(cat);
        }
})

//retreiving the cats present in the database


Cat.find({},function(err,cats){
    if(err){
        console.log(" sonthing went wrong");
    }else{
        console.log(cats)
    }
})