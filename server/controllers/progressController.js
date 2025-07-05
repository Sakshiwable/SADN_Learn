// import Progress from "../models/Progress.js";

// export const unlockNextSection = async (req, res) => {
//   const { index } = req.body;
//   const userId = req.user.id;

//   try {
//     let progress = await Progress.findOne({ user: userId });

//     if (!progress) {
//       progress = await Progress.create({ user: userId, unlocked: [0] });
//     }

//     if (!progress.unlocked.includes(index)) {
//       progress.unlocked.push(index);
//       await progress.save();
//     }

//     res.status(200).json({ message: "Progress updated", unlocked: progress.unlocked });
//   } catch (err) {
//     console.error("Progress unlock error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


import Progress from "../models/Progress.js";

export const unlockNextSection = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user
    const { sectionIndex } = req.body;

    if (sectionIndex == null) {
      return res.status(400).json({ message: "sectionIndex is required" });
    }

    let progress = await Progress.findOne({ user: userId });

    if (!progress) {
      // First time progress record
      progress = new Progress({
        user: userId,
        unlocked: [0, sectionIndex],
      });
    } else {
      if (!progress.unlocked.includes(sectionIndex)) {
        progress.unlocked.push(sectionIndex);
      }
    }

    await progress.save();

    res.json({
      message: "✅ Section unlocked",
      unlocked: progress.unlocked,
    });
  } catch (err) {
    console.error("❌ Unlock error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
