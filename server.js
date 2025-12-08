import express from 'express';
import cors from 'cors';
import  connectDB  from './db.js';
import AuthRoutes from './Routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/auth', AuthRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});