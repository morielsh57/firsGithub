const express = require('express');
const { FoodModel, validFoods } = require('../models/foodModel');
const {auth} = require("../middleware/auth");
const router = express.Router();

/* GET home page. */
router.get('/', async(req, res) => {
    let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
    let page = req.query.page;
    let sortQ = req.query.sort;
    let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
    try{
        let data = await FoodModel.find({})
        .sort({[sortQ]:ifReverse})
        .limit(perPage)
        .skip(page * perPage)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
      }
});

router.get('/search', async(req, res) => {
    let searchQ = req.query.q;
    try{
        let searchReg = new RegExp(searchQ,"i");
        let data = await FoodModel.find({name:searchReg})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
      }
});

router.post('/', auth , async(req,res) => {
    let validBody = validFoods(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    try{
        let product = new FoodModel(req.body);
        product.user_id = req.userData._id;
        await product.save();
        res.status(201).json(product);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.delete('/:idDel', auth , async(req,res) => {
    let idDel = req.params.idDel;
    try{
        let dataDel = await FoodModel.deleteOne({_id:idDel,user_id:req.userData._id})
        res.json(dataDel);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})

router.put('/:idEdit', auth , async(req,res) => {
    let idEdit = req.params.idEdit;
    
    let validBody = validFoods(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    try{
        let dataEdit = await FoodModel.updateOne({_id:idEdit, user_id:req.userData._id},req.body);
        res.json(dataEdit);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
})




module.exports = router;
