import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import db from "./config/db.js";
import facultyRoutes from "./routes/facutlyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import sessionLocationRoutes from "./routes/sessionLocationRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import studentCoursesRoutes from "./routes/studentCoursesRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log("Connection has been established successfully.".cyan.underline);
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//parse req.body GET/POST
app.use(express.json());
app.use(helmet());

app.get("/", (req, res) => {
  res.status(200).send("api is running!");
});

//routes
app.use("/api/users", userRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/session-location", sessionLocationRoutes);
app.use("/api/students-courses", studentCoursesRoutes);
app.use("/api/stats", statsRoutes);

//error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
