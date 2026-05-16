import User from "../models/user.model.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import config from "../config/config.js";

/**
 * Helper function to generate and send an access token as a cookie
 * along with the user details in the response.
 */
const sendTokenRes = (user, res, msg) => {
  const token = generateAccessToken(user._id);
  res.cookie("accessToken", token);
  return res.status(200).json({
    success: true,
    message: msg,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
};

/**
 * Handles user registration.
 * Checks for existing accounts before creating a new user and generating an access token.
 */
const registerController = async (req, res) => {
  const { firstname, lastname, email, password, contact, isSeller } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { contact }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with email or contact already exists",
      });
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      contact,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenRes(user, res, "User registered successfully.");
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering user",
    });
  }
};

/**
 * Handles standard email/password user login.
 * Validates credentials and generates an access token if successful.
 */
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    sendTokenRes(user, res, "User logged in successfully.");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in user",
    });
  }
};

/**
 * Logs out the currently signed-in user by clearing their access token cookie.
 */
const logoutController = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res
      .status(200)
      .json({ message: "Logout successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while logout.", success: false });
  }
};

/**
 * Fetches and returns the profile details of the currently authenticated user.
 */
const getUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return res
      .status(200)
      .json({ message: "User fetched successfully.", success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while fetching user.",
      success: false,
    });
  }
};

export {
  registerController,
  loginController,
  logoutController,
  getUserController,
};
