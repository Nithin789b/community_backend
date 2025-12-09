import express from 'express';
import  {submitDonationForm, getAllDonationForms} from '../Controllers/bloodController.js';
import { verifyToken } from '../Middlewares/verifyToken.js';
const router = express.Router();

router.post('/donation-form', verifyToken, submitDonationForm);
router.get('/getdonations', getAllDonationForms);


export default router;