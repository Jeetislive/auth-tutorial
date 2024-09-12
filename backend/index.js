import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import cors from "cors"

dotenv.config();


const PORT = process.env.PORT || 8000;

const app = express();

// Middleware

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // allows us to accept requests from this website
app.use(express.json()) //allows us to parse incoming requests: req.body
app.use(cookieParser()) // allows us to parse incoming cookies

app.get("/",(req,res) => {
    res.send("Hello, World!");
})

// Routes
app.use("/api/auth", authRoutes);


// connect to Database
connectDB();

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})