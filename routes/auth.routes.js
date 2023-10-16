import { Router } from 'express';
import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import Joi from '@hapi/joi';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const router = Router();

// Define un esquema de validación con Joi
const registerSchema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(), // Valida que sea una dirección de correo electrónico válida
    password: Joi.string().min(6).max(255).required(),
});


const loginSchema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(), // Valida que sea una dirección de correo electrónico válida
    password: Joi.string().min(6).max(255).required(),
});


// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Valida los datos de entrada contra el esquema
    const { error } = registerSchema.validate(req.body);

    if (error) {
        // Si hay un error de validación, devuelve una respuesta de error
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    // Verifica si el correo ya existe en la base de datos
    const emailExists = await User.findOne({ email });


    if (emailExists) {
        return res.status(400).json({
            error: true,
            message: "Este correo ya existe"
        });
    }

    try {
        // Hashea la contraseña antes de almacenarla en la base de datos
        const passwordHash = await bcryptjs.hash(password, 10);

        // Crea un nuevo usuario en la base de datos
        const newUser = new User({
            name,
            email,
            password: passwordHash,
        });

        // Guarda el nuevo usuario en la base de datos
        const userDB = await newUser.save();

        // Devuelve una respuesta con los datos del usuario registrado
        res.json({
            id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            password: userDB.password, // Nota: No es una buena práctica devolver la contraseña en la respuesta real.
            date: userDB.date
        });

    } catch (error) {
        // Maneja errores de servidor
        res.status(500).json({
            message: "Error al registrar el usuario: " + error.message,
        });
    }
});

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);

    if (error) {
        // Si hay un error de validación, devuelve una respuesta de error
        return res.status(400).json({
            error: error.details[0].message
        });
    }

    //verificamos si el correo del usuario existe
    const user = await User.findOne({ email });

    //si no exite 
    if (!user) {
        return res.status(400).json({
            error: true,
            message: "Correo no encontrado"
        });
    }


    //si exite el correo tenemos que comparar la contraseña ya que está encriptafa

    const validarPassword = await bcryptjs.compare(password, user.password);
    //si no son las mismas contrasñeas 
    if (!validarPassword) {
        return res.status(400).json({
            error: true,
            message: "password not match"
        });
    }

    const token = jwt.sign({
        name: user.name,
        id: user._id,

    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        error: null,
        data: { token }
    })

})

export default router;


