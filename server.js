import express from 'express';
import cors from 'cors';
import  connectDB  from './db.js';
import AuthRoutes from './Routes/authRoutes.js';
import router from './Routes/bloodRoutes.js';
import cookieParser from "cookie-parser";
import mailRouter from './Routes/mailRoutes.js';
import medicineRoutes from './Routes/medicineRoutes.js';


const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use('/api/auth', AuthRoutes);
app.use('/api/blood', router);
app.use('/api/mail', mailRouter);
app.use('/api/medicine',medicineRoutes );

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});