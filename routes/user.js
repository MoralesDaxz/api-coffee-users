import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();
const router = express.Router();
const URI = process.env.MONGODB_URI;

/* Obteniendo usuarios */
router.get("/", async (req, res) => {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const database = client.db("aroma");
    const collection = database.collection("user");
    const users = await collection.find({}).toArray();
    /* console.log("Users fetched:", users); */
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    return await client.close();
  }
});

// Ruta POST: Agregar un nuevo usuario
router.post("/new", async (req, res) => {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const database = client.db("aroma");
    const collection = database.collection("user");
    // Verificar si el correo electrónico ya está registrado

    const existingUser = await collection.findOne({ email: req.body.email });

    if (!existingUser) {
      // Crear el nuevo usuario
      const newUser = {
        ...req.body,
        createdAt: new Date(),
      };
      const result = await collection.insertOne(newUser);
      console.log("User inserted:", result.insertedId);
      res.status(201).json({
        message: "User created successfully",
        userId: result.insertedId,
      });
    }
    return res.status(400).json({ message: "Email already registered" });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

// Ruta POST: Ingreso segun correo y contraseña
router.post("/login", async (req, res) => {
  const client = new MongoClient(URI);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("aroma");
    const collection = database.collection("user");

    // Verificar si existe un usuario con el email proporcionado
    const user = await collection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verificar si la contraseña proporcionada coincide
    // Para este ejemplo, asumimos que la contraseña no está encriptada
    // En un entorno de producción, deberías encriptar y comparar las contraseñas
    if (user.pass !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Si el email y la contraseña coinciden, devolver los datos requeridos
    const { _id, name, lastName, subscription } = user;
    res.status(200).json({message:"ok", _id, name, lastName, subscription });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

export default router;


