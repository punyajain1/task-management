const jwt = require('jsonwebtoken');
const key = "punyauser123"

function userMiddleware(req,res,next){
    const token = req.headers.tuser;
    try{
        if(!token){
            return res.status(401).json({ msg: "Unauthorized" });
        }else{
            const decoded = jwt.verify(token , key);
            if(decoded){
                req.userid = decoded.id;
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