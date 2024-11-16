const jwt = require("jsonwebtoken");
const { usermodel } = require("../db/db");
const key = "punya123";

async function adminMiddleware(req,res,next){
    const token = req.headers.tadmin;
    try{
        if(!token){
            res.json({msg:"you are not signed in"})
        }else{
            const decode= jwt.verify(token , key);
            const admin = await usermodel.findById(decode.id);
            if(decode){
                req.adminid = admin._id;
                console.log("Admin ID:", req.adminid);
                next();
            }else{
                res.json({msg:"unautorised"})
            }
        }
    }catch(e){
        res.status(300).json({msg:"error" , error:e.message})

    }
}

module.exports = {adminMiddleware};