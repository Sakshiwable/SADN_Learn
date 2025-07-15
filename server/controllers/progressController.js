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
      message: "Section unlocked",
      unlocked: progress.unlocked,
    });
  } catch (err) {
    console.error("Unlock error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
