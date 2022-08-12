import cors from "cors";
import connectToDB from "./config/db";
import express, { Express } from "express";

// Routes
import AuthRoutes from "./routes/auth.route";
import UserRoutes from "./routes/users.route";
import TasksRoutes from "./routes/tasks.route";
import ProjectsRoutes from "./routes/projects.route";

const app: Express = express();

connectToDB();

app.use(cors());

// Use this to read json in req body
app.use(express.json());

app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/projects", ProjectsRoutes);
app.use("/api/tasks", TasksRoutes);

export default app;