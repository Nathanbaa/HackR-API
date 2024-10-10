import bcrypt from "bcryptjs";
import User from "../models/user.js";

const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (!existingAdmin) {
      const hashPassword = await bcrypt.hash("adminpassword", 10);

      const admin = new User({
        first_name: "Admin",
        email: "admin@example.com",
        password: hashPassword,
        role: "admin",
      });

      await admin.save();
      console.log("🟢 Default admin created successfully");
    } else {
      console.log("🔵 Admin already exists");
    }
  } catch (error) {
    console.error("🔴 Error creating default admin: ", error);
  }
};

export default createDefaultAdmin;
