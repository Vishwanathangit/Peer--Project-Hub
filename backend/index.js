import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/connectDb.js";
import connectCloudinary from "./config/connectCloudinary.js";

import authRouter from "./router/authRouter.js";
import projectRouter from "./router/projectRouter.js";
import commentRouter from "./router/commentRouter.js";
import userRouter from "./router/userRouter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [process.env.FRONTEND_URL];
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);

async function startServer() {
  try {
    await connectCloudinary();
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is Running Successfully`);
    });
  } catch (err) {
    console.log(`Error in Running Server - ${err.message}`);
    process.exit(1);
  }
}

startServer();
