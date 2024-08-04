const jwt=require('jsonwebtoken');
const JWT_PASSWORD=require('../config');

async function authMiddleware(req,res,next){
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))return res.status(403).json("sdhsdks");
    const token=authHeader.split(' ')[1];
    try {
        const decoded=await jwt.verify(token,JWT_PASSWORD);
        req.userId=decoded.userId;
        next();
    } catch (error) {
        res.status(404).json({message:"not authenticated"});
    }
}

module.exports={authMiddleware};