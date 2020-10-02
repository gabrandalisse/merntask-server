const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

// Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    // Revisar si existen errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    };

    try {
        // Extraer el proyecto y controlar si existe
        const { proyecto } = req.body;
    
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // Crear tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
};

// Obtener tareas por proyectos
exports.obtenerTareas = async (req, res) => {
   
    try {
        // Extraer el proyecto y controlar si existe
        const { proyecto } = req.query;
    
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // Obtener tareas por proyecto
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });


    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
};

// Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y controlar si existe
        const { proyecto, nombre, estado } = req.body;

        // Revisar si tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({ msg: "No existe esa tarea" });
        }

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // Crear un objeto con la nueva info
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        
        // Guardar tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea });
 
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
};

// Eliminar una tarea
exports.eliminarTarea = async (req, res) => {

    try {
        // Extraer el proyecto y controlar si existe
        const { proyecto } = req.query;

        // Revisar si tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({ msg: "No existe esa tarea" });
        }

        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: "No Autorizado" });
        }

        // Eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Tarea Eliminada" });
 
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
};