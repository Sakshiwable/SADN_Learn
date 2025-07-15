// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String, // Optional for Firebase users
//   role: { type: String, enum: ["Learner", "admin"], default: "Learner" },
// });

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "Learner" },
  isVerified: { type: Boolean, default: false }, // 👈 Add this
});

export default mongoose.model("User", userSchema);
