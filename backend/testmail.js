require("dotenv").config();
const nodemailer = require("nodemailer");

async function testEmail() {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log("✅ SMTP VERIFIED");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "beerpuriv@gmail.com",
            subject: "VINORA Test Email",
            text: "This is a test email from VINORA.",
        });

        console.log("✅ EMAIL SENT");
        console.log(info);
    } catch (err) {
        console.error("❌ SMTP ERROR");
        console.error(err);
    }
}

testEmail();