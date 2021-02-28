import * as nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "banks@nussman.us",
        pass: process.env.MAIL_PASSWORD
    }
}); 
