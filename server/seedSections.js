// seedSections.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Section from "./models/Section.js";

// Load environment variables
dotenv.config();

// Fallback if .env is missing MONGO_URI
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/MathWeb";

// Section data
const sections = [
  { sectionNumber: 1, title: "Addition" },
  { sectionNumber: 2, title: "Multiplication" },
  { sectionNumber: 3, title: "Prime and Composite Numbers" },
  { sectionNumber: 4, title: "Divisibility by 3" },
  { sectionNumber: 5, title: "SADN of a Prime" },
  { sectionNumber: 6, title: "Odd and Even Numbers" },
  { sectionNumber: 7, title: "Classifying Odd Numbers (S1, S2, S3)" },
  { sectionNumber: 8, title: "Why Only 3 Sequences?" },
  { sectionNumber: 9, title: "Even = Even + Even or Odd + Odd" },
  { sectionNumber: 10, title: "Even + Even → Never Prime" },
  { sectionNumber: 11, title: "Formula: Total Odd Combinations" },
  { sectionNumber: 12, title: "S1 and S2 Split Formula" },
  { sectionNumber: 13, title: "Total Valid Combinations for 2k" },
  { sectionNumber: 14, title: "SADN & Digits in Prime Pairs" },
  { sectionNumber: 15, title: "Cyclic Sequence Elements of Even Numbers" },
  { sectionNumber: 16, title: "Formula for Acceptable Combinations (nAC)" },
  { sectionNumber: 17, title: "Proof: k is Prime → GC Holds" },
  { sectionNumber: 18, title: "k is Composite → GC May Fail" },
  { sectionNumber: 19, title: "Count Composites Below 2k on Sequence" },
  { sectionNumber: 20, title: "If nAC > nC → GC Proven" },
  { sectionNumber: 21, title: "If nAC ≤ nC → GC Uncertain" },
  { sectionNumber: 22, title: "Need All c1 + c2 Types When nAC ≤ nC" },
  { sectionNumber: 23, title: "3 Types of c1 + c2 Combinations" },
  { sectionNumber: 24, title: "Formula for Total c1 + c2 Combos (nCC)" },
  { sectionNumber: 25, title: "Compare Actual vs Minimum c1 + c2" },
  { sectionNumber: 26, title: "Relation Between Actual and Minimum" },
  { sectionNumber: 27, title: "Deriving p1 + p2 Type Combos" },
  { sectionNumber: 28, title: "Wrapping Up: All Patterns Together" },
];

// Connect and seed
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await Section.deleteMany(); // Clear existing
    await Section.insertMany(
      sections.map((s) => ({
        ...s,
        content: "",
        questions: [],
      }))
    );
    console.log("✅ Sections seeded successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Failed to seed sections:", err);
    process.exit(1);
  });
