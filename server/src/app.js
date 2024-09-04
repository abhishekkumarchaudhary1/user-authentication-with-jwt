import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Initialize express app
const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Import routes
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';


// Use routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);


// Export the app
export { app };
