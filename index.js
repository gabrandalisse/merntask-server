const cors = require("cors");
const express = require("express");
const connectToDB = require("./config/db");

const app = express();

connectToDB();

app.use(cors());

// Use express.json so we can read data
app.use(express.json({ extended: true }));

const port = process.env.PORT || 4000;

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

app.listen(port, "0.0.0.0", () => {
  console.log(`the server is running in the port ${port}`);
});
