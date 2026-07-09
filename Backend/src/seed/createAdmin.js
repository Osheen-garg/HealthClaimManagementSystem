const bcrypt = require("bcryptjs");
const User = require("../Models/user.model");

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      role: "admin",
    });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await User.create({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      phone: process.env.ADMIN_PHONE,
      role: "admin",
    });

    console.log("Admin account created successfully");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = createAdmin;