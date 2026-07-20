require("dotenv").config();
const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
    try {
        console.log("EMAIL_USER =", process.env.EMAIL_USER);
        console.log("EMAIL_PASS =", process.env.EMAIL_PASS);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Verify connection configuration
        await transporter.verify();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "VINORA - Verification OTP",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #ff0000; text-align: center;">VINORA</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering/logging in to VINORA. Please use the following One-Time Password (OTP) to verify your account. This OTP is valid for 10 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background-color: #f5f5f5; padding: 10px 20px; border-radius: 5px; border: 1px dashed #ccc;">${otp}</span>
                    </div>
                    <p>If you did not request this OTP, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message. Please do not reply to this email.</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("EMAIL SENT");
        console.log(info);
        return true;
    } catch (error) {
        console.error(`SMTP Error: ${error.message}`);
        throw error;
    }
};

const sendOtpMobile = async (mobile, otp) => {
    // For non-South Indian states, we simulate SMS and log the OTP to the console.
    console.log(`========================================`);
    console.log(`SIMULATED SMS to ${mobile}: Your VINORA OTP is ${otp}. Valid for 10 minutes.`);
    console.log(`========================================`);
    return true;
};

module.exports = {
    sendOtpEmail,
    sendOtpMobile,
};
