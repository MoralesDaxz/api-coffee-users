// index.js
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/user.js';
import cors from 'cors';
dotenv.config();  // Asegúrate de que dotenv se cargue lo antes posible
const PORT = process.env.PORT || 5000;
const app = express();
// Middleware
app.use(cors()); // Middleware para habilitar CORS si es necesario
app.use(express.json()); // Middleware para manejar datos JSON

// Routes
// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send("Welcome to the API!");
  });
  
  // Rutas para usuarios, prefijo /users
  app.use('/users', userRoutes); 

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
