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

app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/projects", ProjectsRoutes);
app.use("/api/tasks", TasksRoutes);

export default app;


// import { SpartanRepository } from './repositories/SpartanRepository'
// import { Spartan } from './entities/Spartan';


// // creating a function that execute self runs
// (async () => {
//     // connecting at mongoClient
//     const connection = await MongoClient.connect('mongodb://localhost');
//     const db = connection.db('warriors');

//     // our operations
//     // creating a spartan
//     const spartan = new Spartan('Leonidas', 1020);

//     // initializing the repository
//     const repository = new SpartanRepository(db, 'spartans');

//     // call create method from generic repository
//     const result = await repository.create(spartan);
//     console.log(`spartan inserted with ${result ? 'success' : 'fail'}`)

//     //call specific method from spartan class
//     const count = await repository.countOfSpartans();
//     console.log(`the count of spartans is ${count}`)

//     /**
//      * spartan inserted with success
//       the count of spartans is 1
//      */
// })();