const indexR = require("./index")
const usersR = require("./users")
const studentsR = require("./students")
const foodsR = require("./foods")
const monfoDb = require("../db/mongoConnect");

exports.corseAccessControl = (app) => {
    app.all('*',  (req, res, next) => {
        if (!req.get('Origin')) return next();
        res.set('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token');
        next();
      });
}

exports.routesInit = (app) => {
    app.use("/", indexR);
    app.use("/users", usersR);
    app.use("/students", studentsR);
    app.use("/foods", foodsR);
    
    app.use("/", (req,res) => {
        res.status(404).json({msg:"404 url page not found"})
    });
}