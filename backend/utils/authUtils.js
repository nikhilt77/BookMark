const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
  // Add debug logging
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing from environment variables");
    throw new Error("JWT_SECRET configuration is missing");
  }

  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
};

module.exports = { generateToken };
