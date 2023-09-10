//jshint esversion:6
//Level 1 --Username and Password
// we're going to be using Level 1 security,
// so the lowest level possible of security for our website.
// And this is simply just going to be creating an account for the user, storing their email and password
// in our database so that when they come back at a later date we can check their email against their password
// and see if we should let them pass or not.


const express = require("express")
const bodyParser = require("body-parser")
const ejs = require ("ejs")
const mongoose = require("mongoose")
const app = express();

app.use (express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))

 mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = {
    email:String,
    password:String
}

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
    const newUser=new User ({
        email:req.body.username,
        password:req.body.password
    })

    
     newUser.save().then((value)=>{
    console.log("Successfully saved")
    res.render("secrets");
}).catch((err)=>{console.log("Some Error")})
  
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    console.log(password)
    
      User.findOne({email:username}).then((user)=>{
        if(user.password===password){
            res.render("secrets")
        }else{
            console.log("Invalid Username or Password")
        }
      
      }).catch((error)=>{console.log("some erroe occured")})


  
})






app.listen(3000,function(){
    console.log("Server started on port 3000")
});










/*Now there's just one problem.

If we look at our users collection and we look at the documents in there, there's only one at the moment
but we can see the user's password in plain text.
And this is really really bad because if I had millions of users say I was, I don't know, Amazon or Facebook
or Google and I had all of my users passwords saved in plain text like this
then any one of my employees can look through my database and know what everybody's password is.



So now that we've seen what level 1 authentication looks like, it's time to level up and do right by
our users and increase the security of our website.*/