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
     return res.status(201).json({
        status:"ok",
        message: "User created successfully",
        userId: result.insertedId,
      });
    }
    return res.status(400).json({ status: "fail", message: "Email already registered" });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

export default router;

/* 
    router.post("/", async (req, res) => {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const database = client.db("aroma");
        const collection = database.collection("user");
        const users = await collection.find({}).toArray();
        console.log("Users fetched:", users);
        return res.json(users);
      } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
      } finally {
        await client.close();
      }
    }); */
