if (process.env.NODE_ENV !== "production") {
    await import('dotenv/config');
}
// import { mailtrapClient, sender } from "../config/mailtrap.js";

import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "../assets/emailTemplates.js";
import transporter from "../config/nodemailer.js";

// const sendVerificationEmail = async (res, email, verificationToken) => {
//     try {
//         const recipient = [{ email }];

//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: 'Verify Your Email',
//             html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
//             category: 'Email Verification'
//         })

//         // console.log("Verify email sent successfully", response);

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

const sendVerificationEmail = async (res, email, verificationToken) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Verify Your Email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        }

        const response = await transporter.sendMail(mailOptions);
        // console.log("Verify email sent successfully", response);

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// const sendWelcomeEmail = async (res, name, email) => {
//     try {
//         const recipient = [{ email }];

//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             template_uuid: "1a6130d5-d25d-491f-ba46-b93afb4afbca",
//             template_variables: {
//                 "company_info_name": "PixAI",
//                 "name": name,
//             },
//         })

//         // console.log("Welcome email sent successfully", response);

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

const sendWelcomeEmail = async (res, name, email) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Welcome to PixAI',
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
        }

        const response = await transporter.sendMail(mailOptions);
        // console.log("Verify email sent successfully", response);

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// const sendPasswordResetEmail = async (res, email, resetURL) => {
//     try {
//         const recipient = [{ email }];

//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Reset your password",
//             html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
//             category: 'Password Reset'
//         })

//         // console.log("Password reset email sent successfully", response);

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

const sendPasswordResetEmail = async (res, email, resetURL) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        }

        const response = await transporter.sendMail(mailOptions);
        // console.log("Password reset email sent successfully", response);

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// const sendPasswordResetSuccessEmail = async (res, email) => {
//     try {
//         const recipient = [{ email }];

//         const response = await mailtrapClient.send({
//             from: sender,
//             to: recipient,
//             subject: "Password Reset Successful",
//             html: PASSWORD_RESET_SUCCESS_TEMPLATE,
//             category: 'Password Reset'
//         })

//         // console.log("Password reset success email sent successfully", response);

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

const sendPasswordResetSuccessEmail = async (res, email) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: email,
            subject: 'Password Reset Successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        }

        const response = await transporter.sendMail(mailOptions);
        // console.log("Password reset success email sent successfully", response);

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail };