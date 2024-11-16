const jwt = require('jsonwebtoken');
const { usermodel } = require('../db/db');
const key = "punyauser123"

async function userMiddleware(req,res,next){
    const token = req.headers.tuser;
    try{
        if(!token){
            return res.status(401).json({ msg: "Unauthorized" });
        }else{
            const decoded = jwt.verify(token , key);
            const user= await usermodel.findById(decoded.id);
            if(decoded){
                req.userid = user._id;
                next();
            }else{
                res.status(403).json({ message: "You are not signed in" });
            }
        }
    }catch(e){
        return res.status(403).json({ msg: "Invalid token" });
    }
}

module.exports = {userMiddleware};