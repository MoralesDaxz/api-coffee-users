// index.js
import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/user.js";
import cors from "cors";
dotenv.config(); // Asegúrate de que dotenv se cargue lo antes posible
const PORT = process.env.PORT || 5000;
const app = express();
const corsOptions = {
    origin: ["http://localhost:5000", "https://api-coffee-users.onrender.com"],
    optionsSuccessStatus: 200, // Para algunas versiones de navegadores legacy
  };
// Middleware
app.use(cors()); // Middleware para habilitar CORS si es necesario
app.use(cors(corsOptions));
app.use(express.json()); // Middleware para manejar datos JSON

// Routes

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.send("Users - Welcome");
});

// Rutas para usuarios, prefijo /users
app.use("/users", userRoutes);
/*  Ruta de bienvenida:

GET / muestra "Welcome to the API!".
Obtener usuarios:

GET /users/ se maneja en user.js con la ruta router.get("/"). Cuando esta ruta se monta en index.js con app.use('/users', userRoutes);, se convierte en GET /users/.
Crear un nuevo usuario:

POST /users/new se maneja en user.js con router.post("/new"). Esta ruta, al montarse con app.use('/users', userRoutes);, se convierte en POST /users/new.
Resultado Final
GET http://localhost:5000/users/: Obtiene la lista de usuarios.
POST http://localhost:5000/users/new: Crea un nuevo usuario.
GET http://localhost:5000/: Muestra "Welcome to the API!". */

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
