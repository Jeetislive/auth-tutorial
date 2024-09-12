import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config();
// import { mailtrapClient, sender } from "./mailtrap.config.js"

// export const sendVerificationEmail = async (email, verificationToken) => {
//     const recipient  = [{email}]

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Verify your email!",
//             html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
//             category: "Email Verification"
//         })

//         console.log("Email sent successfully", response);
        
//     } catch (error) {
//         console.error("Error sending Verification email", error);
//         throw new error(`Error sending Verification email ${error}`)
//     }

// }

// export const sendWelcomeEmail = async (email, name) => {
//     const recipient  = [{email}];

//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             template_uuid: "d808b905-8705-4bde-ab26-1df71ed98ddd",
//             template_variables: {
//                 "name": name,
//                 "company_info_name": "Auth Company",
//                 "company_info_address": "Test_Company_info_address",
//                 "company_info_city": "Test_Company_info_city",
//                 "company_info_zip_code": "Test_Company_info_zip_code",
//                 "company_info_country": "Test_Company_info_country"
//               }
//         }); 
//         console.log("Email sent successfully", response);
//     } catch (error) {
//         console.error("Error sending Welcome email", error);
//         throw new error(`Error sending Welcome email ${error}`)
//     }
// }

// export const sendPasswordResetEmail = async (email, resetUrl) => {
//     const recipient  = [{email}];
//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Reset your password!",
//             html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetUrl),
//             category: "Password Reset"
//         })
//         console.log("Email sent successfully", response);
//     } catch (error) {
//         console.error("Error sending Password Reset email", error);
//         throw new error(`Error sending Password Reset email ${error}`)
        
//     }
    
// }

// export const sendResetSuccessEmail = async (email, subject, message) => {
//     const recipient  = [{email}];
//     try {
//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Password reset successfully",
//             html: PASSWORD_RESET_SUCCESS_TEMPLATE,
//             category: "Reset Success"
//         })
//         console.log("Email sent successfully", response);
//     } catch (error) {
//         console.error("Error sending Reset Success email", error);
//         throw new error(`Error sending Reset Success email ${error}`)
//     }
// }
export const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verify your email!",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
    } 

    transporter.sendMail(mailOptions, (error,info) => {
        if(error) {
            console.error("Error sending Verification email", error);
            throw new Error(`Error sending Verification email ${error}`)
        } else {
            console.log("Email sent successfully", info.response);
        }
    })
}

export const sendWelcomeEmail = async (email, name) =>  {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome to our website!",
        html: `
            <h1>Welcome, ${name}!</h1>
            <p>Thank you for signing up. We're excited to have you with us.</p>
        `
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.error("Error sending Welcome email", error);
            throw new Error(`Error sending Welcome email ${error}`)
        } else {
            console.log("Email sent successfully", info.response);
        }
    })
}

export const sendPasswordResetEmail = async (email, resetUrl) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Reset your password!",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl)
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.error("Error sending Password Reset email", error);
            throw new Error(`Error sending Password Reset email ${error}`)
        } else {
            console.log("Email sent successfully", info.response);
        }
    })
}

export const sendResetSuccessEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password reset successfully",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE
    }
    
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.error("Error sending Reset Success email", error);
            throw new Error(`Error sending Reset Success email ${error}`)
        } else {
            console.log("Email sent successfully", info.response);
        }
    })
}



