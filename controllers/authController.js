const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { json } = require("express");

exports.autenticarUsuario = async (req, res) => {

    // Revisar si existen errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({ errores: errores.array() });
    };

    // Extraer email y pass
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });

        if( !usuario ){
            return res.status(400).json({ msg: "El usuario no existe" });
        };

        // Revisar el pass
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({ msg: "Password incorrecto" });
        };

        // Si todo es correcto crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmacion
            res.json({ token });
        });
        
    } catch (error) {
        console.log(error);
    }
};

// Obtener usuario autenticado
exports.usuarioAutenticado = async (req, res) => {

    try {
        const usuario = await Usuario.findById(req.usuario.id).select("-password"); // No trae el pass
        res.json({ usuario });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error" });
    }
};