const jwt = require('jsonwebtoken');
const {config} = require("../config/secretData");

exports.auth = (req,res,next) => {
    let token = req.header("auth-token");
    if(!token){
        return res.status(400).json({message:"you must send token to this endpoint to get info of user"});
    }
    try{
        let decodeToken  = jwt.verify(token,config.jwtSecret);
        req.userData = decodeToken;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(400).json({message:"token invalid or expired"});
    }
}