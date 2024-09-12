import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

// signup
export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if ( !email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existsUser = await User.findOne({email});
        if (existsUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const verificationToken = Math.floor(100000 + Math.random() * 900000);
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });
        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email,verificationToken);


        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        })
        
    } catch (error) {
        res.status(500).json(error.message)
    }

    
}
// verify email
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationExpiresAt: { $gt: Date.now() }
        });
        if(!user) {
            return res.status(400).json({ message: "Verification code is invalid or expired" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        res.status(500).json({err: error.message})
    }

}
// forgot password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
        await user.save();
        //send email
        await sendPasswordResetEmail(user.email,`${process.env.Client_url}/reset-password/${resetToken}`);
        res.status(200).json({ message: "Reset password email sent successfully" });
    }catch (error) {
        res.status(500).json({ message: error.message })
    }
}
// reset password
export const resetPassword = async (req, res) => {
    try{
        const {token} = req.params;
        const { password } = req.body;

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: {$gt: Date.now()}});
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        //update user
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);
        res.status(200).json({ message: "Password reset successfully" });
    } catch {

    }

}
// login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();

        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
        
    }
}
 // logout
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, msg: "Logged Out Successfully!"})
}


// check Auth
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        res.json({
            success: true,
            user,
        });
    } catch (error) {
        console.log("Error in CheckAuth");
        res.status(400).json({ message: error.message }); 
    }
}
