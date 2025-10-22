import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
dotenv.config();


//routes import
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

//mongodb connection
import connectDB from './config/db.js';
connectDB();



const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// routes
app.get('/demo', (req, res) => res.send("Hello from the server"))

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/blog', blogRoutes);

// connect to server

const PORT = process.env.PORT || 8080;

app.listen( PORT , () => {
    console.log(`Server is running on ${process.env.DEV_MODE} port ${PORT}`);
});
