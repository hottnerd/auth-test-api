const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const customFields = {
    usernamefield : "username",
    passwordField : "password"
};


const verifyCallback =  async (username,password,done) => {
    try{
        if(!username || !password){
            return done(null,false);
        }
        const user = await User.findOne({username : username}).select("+password").exec();
        if(!user){
            return done(null,false);
        }

        const isValid = bcrypt.compare(password,user.password);

        if(isValid){
            return done(null,user);
        }else{
            return done(null,false);
        }
    }catch(err){
        done(err);
    }
};

const localStrategy = new LocalStrategy(customFields,verifyCallback);

const googleStategy = new GoogleStrategy({
    callbackURL:"http://127.0.0.1:8000/api/auth-google-redirect",
    clientID: "934758287067-cjnt8s5eahu67g4apk5qecldpvhgoipm.apps.googleusercontent.com",
    clientSecret : "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"
},async (accessToken,refreshToken,profile,done) => {

    try{
        const user = await User.findOne({googleId : profile.id}).exec();
        if(user){
            return done(null,user);
        }else{
            const newUser = await User.create({
                username:profile.displayName,
                googleId:profile.id
            });
            return done(null,newUser);
        }  
    }catch(err){
        return done(err)
    }

    
});


passport.use(googleStategy);
passport.use(localStrategy);


passport.serializeUser((user,done)=>{
    done(null,user._id);
});

passport.deserializeUser( async (userId,done)=>{
    try{
        const user = await User.findById(userId);
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }

    }catch(err){
        done(err);
    }
    
});