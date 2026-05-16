import mongoose from "mongoose";
import config from "../config/config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { dbName: "ncs_scraper" });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
