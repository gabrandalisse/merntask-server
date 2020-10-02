const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

// Crear el servidor
const app = express();

// Conectar a la BD
conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar express.json para poder leer datos
app.use(express.json({ extended: true }));

// Puerto de la app
const PORT =  process.env.PORT || 4000;

// Rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

// Iniciar el servidor  
app.listen(PORT, () => {
    console.log(`El servidor esta funcionado en el puerto ${PORT}`)
});