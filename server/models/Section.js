import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  sectionNumber: Number,
  title: { type: String, required: true },
  content: { type: String, default: "" }, // ✅ Important fix
  questions: [
    {
      question: String,
      answer: String,
    },
  ],
});

export default mongoose.model("Section", sectionSchema);
