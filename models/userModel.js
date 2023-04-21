const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {type:String,required:true,unique:true},
    googleId: {type:String,required:false,unique:true},
    password:{type:String,required:false,select:false}
})

module.exports = model("User",userSchema)