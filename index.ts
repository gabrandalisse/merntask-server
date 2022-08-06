import cors from "cors";
import connectToDB from "./config/db";
import express, { Express } from "express";

// Routes
import AuthRoutes from "./routes/auth";
import UserRoutes from "./routes/users";
import TasksRoutes from "./routes/tasks";
import ProjectsRoutes from "./routes/projects";

const app: Express = express();

connectToDB();

app.use(cors());

// Use this to read json in req body
app.use(express.json());

const port: number = Number(process.env.PORT) || 4000;

app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/projects", ProjectsRoutes);
app.use("/api/tasks", TasksRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`⚡️ [server]: Server is running at https://localhost:${port}`);
});
