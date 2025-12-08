import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken = async(req,res,next) => {
    try{
        const token = req.cookies.Authtoken;
        if(!token) {
            return res.status(400).json({success : false , messsage : "Unauthorised user"})
        }
        const payload = jwt.verify(token ,process.env.JWT_SECRET)
        if(!payload){
            return res.status(400).json({success : fasle , messsage : "Unauthorised user"})
        }
        res.userId = payload.id;
        next();
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false, message: "Internal server error from verify token ."});
    }

}