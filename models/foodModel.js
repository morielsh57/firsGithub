const mongoose = require('mongoose');
const Joi = require('joi');

const foodSchema = new mongoose.Schema({
    name:String,
    cal:Number,
    price:Number,
    img:String,
    user_id:String,
    date_created:{
        type:Date, default:Date.now
    }
})

exports.FoodModel = mongoose.model("foods",foodSchema);

exports.validFoods = (_bodyPayload) => {
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(100).required(),
        cal:Joi.number().min(1).required(),
        price:Joi.number().min(1).required(),
        img:Joi.string().min(2).max(200)

    })
    return joiSchema.validate(_bodyPayload);
}