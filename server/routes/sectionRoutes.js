import express from "express";
import {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/sectionController.js";

const router = express.Router();

router.get("/", getAllSections);
router.get("/:id", getSectionById);
router.post("/", createSection);      // ✅ This must exist
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);

// POST /sections (in routes/sectionRoutes.js)
router.post("/", async (req, res) => {
  try {
    const { title, content, sectionNumber, questions } = req.body;
    const section = new Section({ title, content, sectionNumber, questions });
    await section.save();
    res.status(201).json(section);
  } catch (err) {
    console.error("Error creating section:", err);
    res.status(500).json({ message: "Failed to create section" });
  }
});


export default router;
