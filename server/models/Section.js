// import mongoose from "mongoose";

// const sectionSchema = new mongoose.Schema({
//   sectionNumber: Number,
//   title: String,
//   content: String,
//   questions: [
//     {
//       questionText: String,
//       correctAnswer: String,
//     },
//   ],
// });

// export default mongoose.model("Section", sectionSchema);



// models/Section.js
import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  sectionNumber: Number,
  title: String,
  content: String,
  questions: [
    {
      question: String,
      answer: String,
    },
  ],
});

export default mongoose.model("Section", sectionSchema);
