// // controllers/sectionController.js

// import Section from "../models/Section.js";

// // ✅ GET all sections
// export const getAllSections = async (req, res) => {
//   try {
//     const sections = await Section.find();
//     res.status(200).json(sections);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ GET single section
// export const getSectionById = async (req, res) => {
//   try {
//     const section = await Section.findById(req.params.id);
//     if (!section) return res.status(404).json({ message: "Section not found" });
//     res.status(200).json(section);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ POST create a section
// export const createSection = async (req, res) => {
//   try {
//     const newSection = new Section(req.body);
//     await newSection.save();
//     res.status(201).json(newSection);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ PUT update a section
// export const updateSection = async (req, res) => {
//   try {
//     const updatedSection = await Section.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.status(200).json(updatedSection);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ DELETE section
// export const deleteSection = async (req, res) => {
//   try {
//     await Section.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Section deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




// backend/controllers/sectionController.js
import Section from "../models/Section.js";
import mongoose from "mongoose";

// GET all sections
export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find();
    res.status(200).json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one section
export const getSectionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid section ID" });
  }

  try {
    const section = await Section.findById(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.status(200).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create
export const createSection = async (req, res) => {
  try {
    const newSection = new Section(req.body);
    await newSection.save();
    res.status(201).json(newSection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update
export const updateSection = async (req, res) => {
  try {
    const updatedSection = await Section.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedSection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteSection = async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Section deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
