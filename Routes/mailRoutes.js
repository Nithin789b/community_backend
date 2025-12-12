import { Router } from "express";
import { sendMail } from "../Controllers/mailController.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const mailRouter = Router() ;

mailRouter.post('/send', verifyToken, sendMail) ;
export default mailRouter ;