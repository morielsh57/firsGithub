const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {config} = require("../config/secretData");

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    role:{
        type:String, default:"regular"
    },
    data_created:{
        type:Date, default:Date.now
    }
})

exports.UserModel = new mongoose.model("users",userSchema);

exports.genToken = (_id) => {
    let token = jwt.sign({_id},config.jwtSecret,{expiresIn:"60mins"});
    return token;
}

exports.validUser = (_bodyUser) =>{
    let joiSchema = Joi.object({
        email:Joi.string().min(2).max(100).email().required(),
        pass:Joi.string().min(2).max(100).required(),
        name:Joi.string().min(2).max(100).required()
    })
    return joiSchema.validate(_bodyUser);
}

exports.validLogIn = (_bodyUser) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(2).max(100).email().required(),
      pass:Joi.string().min(2).max(100).required()
    })
  // אם יש טעות יחזיר מאפיין שיש בו אירור
    return joiSchema.validate(_bodyUser);
  }