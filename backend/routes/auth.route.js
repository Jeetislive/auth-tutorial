import express from "express"
import { forgotPassword, login, logout, resetPassword, signup, verifyEmail, checkAuth } from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const route = express.Router();

route.get("/check-auth", verifyToken, checkAuth)
route.post("/signup", signup)
route.post("/login", login)
route.post("/logout", logout)


route.post("/verify-email", verifyEmail)
route.post("/forgot-password", forgotPassword)
route.post("/reset-password/:token", resetPassword)



export default route;