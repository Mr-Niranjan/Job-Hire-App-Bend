const jwt = require("jsonwebtoken");

const verifyToken = (req , res , next) =>{
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({message : "Unauthorized"})
        }
        const decode = jwt.verify(token , process.env.SECRET_KEY);
        req.currentUserId = decode.userId;
        console.log(decode);
        next();
        
    } catch (error) {
        console.log(error);
        
    }
}
module.exports = verifyToken;