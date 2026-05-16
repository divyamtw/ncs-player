import { body } from "express-validator";

// fields
const emailField = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email")
  .normalizeEmail();

const passwordField = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 6 characters");

const usernameField = body("username")
  .trim()
  .notEmpty()
  .withMessage("Username is required")
  .isLength({ min: 3 })
  .withMessage("Username too short");

// register
export const registerValidator = [usernameField, emailField, passwordField];

// login
export const loginValidator = [
  emailField,
  body("password").notEmpty().withMessage("Password is required"),
];
