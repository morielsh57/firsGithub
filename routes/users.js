const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { UserModel, validUser, validLogIn, genToken } = require('../models/userModel');
const {auth} = require("../middleware/auth");
const router = express.Router();

/* GET users listing. */
router.get('/', async(req, res) => {
  let sortQ = req.query.sort;
  let ifReverse = (req.query.reverse=="yes") ? -1 : 1;
  let perPage = (req.query.perPage) ? Number(req.query.perPage) : 5;
  let page = req.query.page;
  try{
    let data = await UserModel.find({},{pass:0})
    .sort({[sortQ]:ifReverse})
    .limit(perPage)
    .skip(page*perPage)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
});

router.get('/userInfo', auth, async(req,res) => {
  let userData = await UserModel.findOne({_id:req.userData._id},{pass:0});
  res.json(userData);
})

router.post('/login', async(req,res) => {
  let validBody = validLogIn(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      return res.status(400).json({message:"user not found"});
    }

    let validPass = await bcrypt.compare(req.body.pass,user.pass);
    if(!validPass){
      return res.status(400).json({message:"Pass not good"});
    }

    let userToken = genToken(user._id);
    res.json({token:userToken});
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})

router.post('/', async(req,res) => {
  let validBody = validUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel(req.body);
    let salt = await bcrypt.genSalt(10)
    user.pass= await bcrypt.hash(user.pass,salt)
    await user.save();
    res.status(201).json(_.pick(user,["_id","date_created","name","email"]));
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})


module.exports = router;
