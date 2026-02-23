import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectDb } from './config/dB.js';
import path from 'path';

const app = express();
dotenv.config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();
const PORT = 5001
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});