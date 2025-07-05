import express from "express";
import { signupUser, loginUser } from "../controllers/authController.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ correct import

const router = express.Router();

// ✅ Route: Signup
router.post("/signup", signupUser);

// ✅ Route: Login
router.post("/login", loginUser);

// ✅ Route: Get current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

export default router;
