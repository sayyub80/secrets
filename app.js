//Level 4 Salting and Hashing
/*
-->Now salting takes the hashing a little bit further.
In addition to the password, we also generate a random set of characters and those characters along with
the user's password gets combined and then put through the hash function.
So the resulting hash is created from both the password as well as that random unique salt.

-->we're using bcrypt
it has a concept of what's called Salt rounds. How many rounds you're going to salt your password with?
And obviously the more rounds you do the saltier your password and also the more secure it is from hackers.
*/
require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require ("ejs")
const mongoose = require("mongoose")
const app = express();
const bcrypt=require("bcrypt")
const saltRounds = 10;



app.use (express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))

 mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

const User = new mongoose.model("User",userSchema)

app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})



app.post("/register",function(req,res){
  
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        
        const newUser=new User ({
            email:req.body.username,
            password:hash
        })
    
         
         newUser.save().then((value)=>{
        console.log("Successfully saved")
        res.render("secrets");
    }).catch((err)=>{console.log("Some Error")})
      

    });
   
   
    



})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password
    console.log(password)
    
      User.findOne({email:username}).then((user)=>{
        bcrypt.compare(password, user.password, function(err, result) {
           if(result===true){
             res.render("secrets")
           }
           
        });
      
      }).catch((error)=>{console.log("some erroe occured")})


  
})






app.listen(3000,function(){
    console.log("Server started on port 3000")
});










