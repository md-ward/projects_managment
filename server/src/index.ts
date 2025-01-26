import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import path from "path";
/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(
  "/public/images",
  express.static(path.join(__dirname, "public", "images"))
);app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

const port = Number(process.env.PORT) || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
