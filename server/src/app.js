import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import config from "./config/config.js";

const app = express();

app.use(
  cors({
    origin: config.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Hello, Dev!");
});

//import routes
import AuthRoutes from "./routes/auth.routes.js";

//routes
app.use("/api/auth", AuthRoutes);

export default app;
