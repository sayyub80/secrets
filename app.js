/*-->The key that we used to encrypt our database.
So this is now on the internet being crawled by Google completely searchable.
Anybody can see my encryption key which also means that anybody can decrypt my encrypted database using
this secure key. so it's not very secure 
--> the way that developers solve this conundrum is through using something called environment variables.
--> environment variables are basically a very very simple file that we're going to keep certain sensitive
variables such as encryption keys and API keys.
-->I want to show you how we can do this using a really popular package called dotenv.
*/

require('dotenv').config();
const express = require("express")
const encrypt = require("mongoose-encryption")
const bodyParser = require("body-parser")
const ejs = require ("ejs")
const mongoose = require("mongoose")
const app = express();

console.log(process.env.API_KEY)

app.use (express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))

 mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields:["password"] });
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










