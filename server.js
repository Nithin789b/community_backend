import express from 'express';
import cors from 'cors';
import  connectDB  from './db.js';
import AuthRoutes from './Routes/authRoutes.js';
import router from './Routes/bloodRoutes.js';
import cookieParser from "cookie-parser";
import bloodRoutes from './Routes/bloodBankRoutes.js';
import adminRoutes from "./Routes/adminRoutes.js";




const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use('/api/auth', AuthRoutes);
app.use('/api/blood', router);
app.use('/api/bloodbank', bloodRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});