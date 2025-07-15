import Section from "../models/Section.js";
import mongoose from "mongoose";

// GET all sections
export const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find();
    const safeSections = sections.map((sec) => ({
      ...sec._doc,
      content: sec.content || "", 
    }));
    res.status(200).json(safeSections);
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

    // ✅ Make sure content is never null
    res.status(200).json({
      ...section._doc,
      content: section.content || "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create
export const createSection = async (req, res) => {
  try {
    const { title, content, sectionNumber, questions } = req.body;

    const newSection = new Section({
      title,
      content: content || "", // ✅ safe fallback
      sectionNumber,
      questions: questions || [],
    });

    await newSection.save();
    res.status(201).json(newSection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update
export const updateSection = async (req, res) => {
  try {
    const { title, content, questions } = req.body;

    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content: content || "", // ✅ safe fallback
        questions: questions || [],
      },
      { new: true }
    );

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
