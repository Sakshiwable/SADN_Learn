import express from "express";
import { signupUser, loginUser, verifyEmail } from "../controllers/authController.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Signup
router.post("/signup", signupUser);

// ✅ Login
router.post("/login", loginUser);


// ✅ Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

router.get("/verify-email", verifyEmail);

// ✅ Update user profile (name or password)
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Update failed:", error.message);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

export default router;


