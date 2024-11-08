const jwt = require("jsonwebtoken");
const user_key = "user1234";

function adminMiddleware(req,res,token){
    const token =req.header.token;
    try{
        if(!token){
            res.json({
                msg:"unautorised"
            })
        }else{
            const decode= jwt.verify(token , key);
            if(decode){
                req.user_id = decode.indexOf;
            }else{
                res.json({msg:"you are not signed in"})
            }
        }
    }catch(e){
        res.status(300).json({msg:"error"})

    }
}

module.exports = {adminMiddleware};