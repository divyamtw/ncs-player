import "dotenv/config";

if (!process.env.MONGODB_URI) throw new Error("MONGODB URI is not defined");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL is not defined");
if (!process.env.SERVER_URL) throw new Error("SERVER_URL is not defined");

const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_URL: process.env.SERVER_URL,
};

export default config;
