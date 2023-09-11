//previous: Encryption-   password + key ---> ciphertext
//Level 3--Hashing 
/*
-->IN encryption system as long as we knew what that was then I can decode it by setting it to the same encryption key.
And we end up being able to retrieve the original text. Now
however, if I was to go and change this to a hash function instead, then you can see that when we try
to decode this using the same hash function MD5, we get the error that "Decoding step is not defined
for Hash function" because you can't really go back.
That's the whole point of the Hash function
and this is what will make our authentication more secure.
So let's go ahead and implement this in our code.

-->install md5
-->remove mongoose-encryption
-->require
-->set md5(req.body.password)


--> The way that hashing algorithms work you can't reverse this back into the plain text of the original password.
-->Now hashing also comes along with its own problems though because as soon as you come up with a problem
   then some motivated hacker will come up with a solution.




*/
require('dotenv').config();
const express = require("express")
const md5=require("md5")
const bodyParser = require("body-parser")
const ejs = require ("ejs")
const mongoose = require("mongoose")
const app = express();



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
    const newUser=new User ({
        email:req.body.username,
        password:md5(req.body.password)
    })

    
     newUser.save().then((value)=>{
    console.log("Successfully saved")
    res.render("secrets");
}).catch((err)=>{console.log("Some Error")})
  
})

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password)
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










