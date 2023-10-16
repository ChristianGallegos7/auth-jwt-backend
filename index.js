// Importa las dependencias necesarias
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js'
import { verifyToken } from './middleware/validate-token.js';
// Configura dotenv para cargar las variables de entorno desde el archivo .env

// Crea una instancia de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Configura CORS
app.use(express.json()); // Parsea las solicitudes como JSON

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/api/user', authRoutes); // Usa las rutas definidas en authRoutes
app.use('/api/admin', verifyToken, adminRoutes)

// Inicia el servidor
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
