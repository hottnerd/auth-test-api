const bcrypt = require("bcrypt");

const validPassword = (password,hashedPassword) => {
    return  bcrypt.compare(password,hashedPassword);
};

const isAuth = (req,res,next) => {
    try{
    console.log(req.session)
    console.log(req.user)
    if(req.isAuthenticated()){
            next();
        }else{
            throw new Error('Unauthorized');
        }
    }catch (err){
        next(err);
    }   
    
};



module.exports = {isAuth ,validPassword};