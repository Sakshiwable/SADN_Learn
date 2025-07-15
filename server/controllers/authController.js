// controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/sendEmail.js";

dotenv.config();

// ✅ Generate Login JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Signup Controller
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser && !existingUser.isVerified) {
      const verificationToken = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_EMAIL_SECRET,
        { expiresIn: "1h" }
      );

      const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
      await sendVerificationEmail(existingUser.email, verificationLink);

      return res.status(400).json({
        message: "Check your email to verify your account.",
      });
    }

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      role: "Learner",
    });

    // ✅ Create the verification token and link
    const verificationToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_EMAIL_SECRET,
      { expiresIn: "1h" }
    );

    const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

    console.log("Verification Link:", verificationLink);
    await sendVerificationEmail(newUser.email, verificationLink);

    // ✅ Create login token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "Signup successful. Please check your email to verify your account.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ✅ Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Email not verified. Please check your inbox.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ✅ Email Verification Controller
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).send("User not found");
    if (user.isVerified) return res.send("Email already verified. You can log in.");

    user.isVerified = true;
    await user.save();

    res.redirect("http://localhost:5173/authpage");
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(400).send("Invalid or expired verification link.");
  }
};
