// import express from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ GET: Get user's unlocked progress
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({ unlocked: user.progress || [0] });
//   } catch (error) {
//     res.status(500).json({ message: "Server error while getting progress" });
//   }
// });

// // ✅ POST: Unlock next section
// router.post("/unlock", authMiddleware, async (req, res) => {
//   try {
//     const { sectionIndex } = req.body; // ✅ Use correct key from frontend
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.progress.includes(sectionIndex)) {
//       user.progress.push(sectionIndex);
//       user.progress.sort((a, b) => a - b);
//       await user.save();
//     }

//     res.json({ unlocked: user.progress });
//   } catch (error) {
//     console.error("Unlock Error:", error);
//     res.status(500).json({ message: "Server error while updating progress" });
//   }
// });

// export default router;


// import express from "express";
// import Progress from "../models/Progress.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ GET: Get user's unlocked progress
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const progress = await Progress.findOne({ user: req.user._id });

//     if (!progress) {
//       // First-time user, return section 0 as unlocked
//       return res.json({ unlocked: [0] });
//     }

//     res.json({ unlocked: progress.unlocked });
//   } catch (error) {
//     console.error("❌ Error getting progress:", error);
//     res.status(500).json({ message: "Server error while getting progress" });
//   }
// });

// // ✅ POST: Unlock next section
// router.post("/unlock", authMiddleware, async (req, res) => {
//   try {
//     const { sectionIndex } = req.body;
//     if (sectionIndex == null) {
//       return res.status(400).json({ message: "sectionIndex is required" });
//     }

//     let progress = await Progress.findOne({ user: req.user._id });

//     if (!progress) {
//       // Create new progress document for this user
//       progress = new Progress({
//         user: req.user._id,
//         unlocked: [0, sectionIndex],
//       });
//     } else {
//       if (!progress.unlocked.includes(sectionIndex)) {
//         progress.unlocked.push(sectionIndex);
//         progress.unlocked.sort((a, b) => a - b); // optional: keep sorted
//       }
//     }

//     await progress.save();
//     res.json({ unlocked: progress.unlocked });
//   } catch (error) {
//     console.error("❌ Unlock Error:", error);
//     res.status(500).json({ message: "Server error while updating progress" });
//   }
// });

// export default router;


// routes/progressRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Progress from "../models/Progress.js";

const router = express.Router();

// ✅ GET: Get user's unlocked progress
router.get("/", authMiddleware, async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });
    if (!progress) {
      // If no progress exists, return default [0]
      return res.json({ unlocked: [0] });
    }

    res.json({ unlocked: progress.unlocked });
  } catch (error) {
    res.status(500).json({ message: "Server error while getting progress" });
  }
});

// ✅ POST: Unlock next section
router.post("/unlock", authMiddleware, async (req, res) => {
  try {
    const { sectionIndex } = req.body;
    if (sectionIndex == null) {
      return res.status(400).json({ message: "sectionIndex is required" });
    }

    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        unlocked: [0, sectionIndex],
      });
    } else {
      if (!progress.unlocked.includes(sectionIndex)) {
        progress.unlocked.push(sectionIndex);
        progress.unlocked.sort((a, b) => a - b);
      }
    }

    await progress.save();

    res.json({ unlocked: progress.unlocked });
  } catch (error) {
    console.error("Unlock Error:", error);
    res.status(500).json({ message: "Server error while updating progress" });
  }
});


export default router;
