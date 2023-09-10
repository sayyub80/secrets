//level 2- Encrytion 
/* level 2 authentication involves the use of encryption.
So what exactly is encryption?
Well basically all it is is just scrambling something so that people can't tell what the original was
unless they were in on the secret and they knew how to unscramble it. */

const express = require("express")
const encrypt = require("mongoose-encryption")
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

const secret = "Thisismylittesecret"
userSchema.plugin(encrypt, { secret: secret,encryptedFields:["password"] });
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










