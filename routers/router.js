const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { isAuth } = require("../utils/auth");

router.post("/login", passport.authenticate("local") ,(req,res,next) => {

    res.status(200).json({message:"login successfully"});

});

router.get("/auth-google",passport.authenticate("google",{
    scope : ["profile"]
})
);

router.get("/auth-google-redirect",passport.authenticate("google",{
    successRedirect : "http://127.0.0.1:8000",
    failureRedirect : "http://127.0.0.1:8000/login"
}))

router.post("/register",async (req,res,next)=>{
    const username = req.body.username
    const passwordRaw = req.body.password
    

    try {
        if(!username ||  !passwordRaw){
            throw new Error('Missing credentials');
        }

        const existingUsername = await User.findOne({username:username}).exec()

        if(existingUsername){
            throw new Error('Duplicated Username');
        }

        const passwordHashed = await bcrypt.hash(passwordRaw,10)
        
        const newUser = await User.create({
            username:username,
            password:passwordHashed
        })

        res.status(201).json(newUser)
    } catch (err) {
        next(err)
    }
});

router.get("/user",isAuth,(req,res,next)=>{

    res.status(200).json(req.user.username);

});



module.exports = router