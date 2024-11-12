const jwt = require("jsonwebtoken");
const key = "punya123";

function adminMiddleware(req,res,next){
    const token = req.headers.token;
    try{
        if(!token){
            res.json({
                msg:"you are not signed in"
            })
        }else{
            const decode= jwt.verify(token , key);
            if(decode){
                req.adminid = decode._id;
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