import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
  first_name: String,
  email: {
    type: String,
    require: true,
    unique: true,
    minLength: 5,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  role: { type: String, default: "user" },
});

export default mongoose.model("User", User);
