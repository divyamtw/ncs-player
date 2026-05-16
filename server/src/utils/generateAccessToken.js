import config from "../config/config.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: "7d" });
};

export default generateAccessToken;
