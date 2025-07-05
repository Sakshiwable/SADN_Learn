import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  unlocked: { type: [Number], default: [0] }, // array of unlocked section indices
});

export default mongoose.model("Progress", progressSchema);
