//level 5
/*
-->we're going to npm i passport passport-local passport-local-mongoose and
finally express-session without the 's'.


*/

require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require ("ejs")
const mongoose = require("mongoose")
const app = express();
const session = require("express-session");
const passport = require('passport');
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate=require('mongoose-findorcreate')

app.use (express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))

//we're going to place this code just above where we have mongoose.connect and just below all of the other app.uses,so right here.
app.use(session({
    secret:"thisisLittlesecret",
    resave: false,
    saveUninitialized: false,
}))

// in order to use passport the first thing we have to do is to initialize it.
app.use(passport.initialize());
app.use(passport.session())

mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = new mongoose.Schema({
    email:String,
    password:String,
   googleId:String,
   secret:String
})

/*now that we've set up our app to use sessions and passport for managing those sessions, the next thing
to do is to set up our last package, passport-local mongoose. */

userSchema.plugin(passportLocalMongoose);     //that is what we're going to use to hash and salt our passwords and to save our users into our MongoDB database.
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema)

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",function(req,res){
    res.render("home")
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile"] })
  );
  app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/secrets",function(req,res){
   User.find({"secret":{$ne:null}}).then((foundUser)=>{
     res.render("secrets",{usersWithSecrets:foundUser})
   })
})

app.get("/submit",function(req,res){
    if(req.isAuthenticated()){
        res.render("submit")
    }else{
        res.redirect("/login")
    }
})

app.post("/submit",function(req,res){
    const submittedSecret=req.body.secret
    console.log(req.user.id);
    User.findById(req.user.id).then((foundUser)=>{
        foundUser.secret=submittedSecret;
        foundUser.save().then(()=>{
            res.redirect("/secrets")
        })
    }).catch((err)=>{
        console.log(err)
    })
        
        
    

})

app.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });



app.post("/register",function(req,res){
  User.register({username:req.body.username},req.body.password, function(err,user){
    if(err){
        console.log(err)
        res.redirect("/register")
    }else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
  })

})

app.post("/login",function(req,res){
 const user = new User({
    username:req.body.username,
    password:req.body.password
 })

 req.login(user,function(err){
    if(err){
        console.log(err)
    }else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
 })

})






app.listen(3000,function(){
    console.log("Server started on port 3000")
});












 //**It's really really important that your code is placed in exactly the same places as I have on the screen
// here because if for example you decided to set up sessions after you tried to use the sessions to serialise
// and deserialise, it won't work.



/*So both when they've successfully registered and when they've successfully logged in using the right
credentials, we're going to send a cookie and tell the browser to hold onto that cookie because the cookie
has a few pieces of information that tells our server about the user, namely that they are authorized
to view any of the pages that require authentication. */