import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password"); // Exclude passwords
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      userCount: users.length,
      users,
    });
  } catch (error) {
    console.error("Error in getting users:", error);
    res.status(500).json({
      success: false,
      message: "Error in getting users",
      error: error.message,
    });
  }
};

// Register Controller
export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

//  Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password fields",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Success
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};
