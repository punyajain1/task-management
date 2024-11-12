const jwt = require('jsonwebtoken');
const key = "punyauser123"

function userMiddleware(req,res){
    const token = req.header.token;
    try{
        if(!token){
            return res.status(401).jsron({ msg: "Unauthorized" });
        }else{
            const decode = jwt.verify(token , key);
            if(decoded){
                req.userId = decoded.id;
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