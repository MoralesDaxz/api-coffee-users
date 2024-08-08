// index.js
import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/user.js';
import cors from 'cors';
dotenv.config();  // Asegúrate de que dotenv se cargue lo antes posible
const PORT = process.env.PORT || 5000;
const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
