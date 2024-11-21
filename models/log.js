import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Log = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userFirstName: { type: String, required: true },
  userEmail: { type: String, required: true },
  url: { type: String, required: true },
  success: { type: Boolean, required: true },
  errorMessage: { type: String, default: null },
  duration: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Log", Log);
