const jwt = require("jsonwebtoken");
const key = "punyaadmin123";

function adminMiddleware(req,res){
    const token =req.header.token;
    try{
        if(!token){
            res.json({
                msg:"you are not signed in"
            })
        }else{
            const decode= jwt.verify(token , key);
            if(decode){
                req.adminid = decode._id;
            }else{
                res.json({msg:"unautorised"})
            }
        }
    }catch(e){
        res.status(300).json({msg:"error"})

    }
}

module.exports = {adminMiddleware};