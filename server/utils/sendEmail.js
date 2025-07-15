// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, verificationLink) => {
  const html = `
    <h2>Email Verification</h2>
    <p>Click below to verify your email address:</p>
    <a href="${verificationLink}">${verificationLink}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await transporter.sendMail({
    from: `"SADN Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email",
    html,
  });
};
