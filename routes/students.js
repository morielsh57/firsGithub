const express = require('express');
const { StudetModel, validStudent } = require("../models/studentModel")
const router = express.Router();

router.get('/', async (req, res) => {
  let perPage = (req.query.perPage)? Number(req.query.perPage) : 10;
  let page = req.query.page;
  let sortQ = req.query.sort;
  let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
  try {
    // sort -> לפי איזה מאפיין נרצה למיין את התוצאות
    // 1-> מהקטן לגדול ASCENDING
    // -1 -> מהגדול לקטן DESCINGING
    let data = await StudetModel.find({})
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

// ראוט שמחזיר לי את מספר הרשומות הקיימות בקולקשן
router.get("/count", async(req,res) => {
  try {
    // countDocuments -> מחזיר את מספר הרשומות ולא מבצע שאילתא
    // שאוספת את כל המידע שדורשת קצת יותר משאבים
    let data = await StudetModel.countDocuments({});
    res.json({count:data});
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})

router.get('/single/:id', async (req, res) => {
  let studentId = req.params.id;
  try {
    let data = await StudetModel.findOne({_id:studentId});
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get('/subject/:subName', async (req, res) => {
  let subName = req.params.subName;
  try {
    let data = await StudetModel.find({subject:subName});
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


router.post("/add", async (req, res) => {
  // בדיקה בצד שרת שהמידע תקין לפני שמגיע למסד נתונים
  let validBody = validStudent(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  // מתחיל פקודות של מסד נתונים
  try{
    // כתיבה חדשה להוספה  של פריט אחד שיותר תקין מבחינת קוד
    let student = new StudetModel(req.body);
    await student.save();
    res.status(201).json(student);

  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})

router.put("/edit/:idEdit", async(req,res) => {
  let idEdit = req.params.idEdit;
  // בדיקה בצד שרת שהמידע תקין לפני שמגיע למסד נתונים
  let validBody = validStudent(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try{
    let updateData = await StudetModel.updateOne({_id:idEdit},req.body);
    res.json(updateData);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})


router.delete("/del/:idDel",async(req,res) => {
  let idDel = req.params.idDel;
  try{
    let delData = await StudetModel.deleteOne({_id:idDel});
    res.json(delData);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})

module.exports = router;
