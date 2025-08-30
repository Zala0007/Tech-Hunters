import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from '../routes/authRoutes'; // <-- update this path if needed

// dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes); // <-- use the correct route

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/h2db';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error', err);
  process.exit(1);
});

export default app;