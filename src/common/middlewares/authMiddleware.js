import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware = async (req,res,next)=>{
    
    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith('Bearer ')){
        const token = authHeader.split(' ')[1]; 

        try {
    
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error("JWT verification failed:", error);
            res.status(401).json({ message: 'Unauthorized' });
        }
    }else{
        console.log("No token provided in Authorization header");
        res.status(401).json({ message: 'Unauthorized' });
    }
}   

export default authMiddleware ;