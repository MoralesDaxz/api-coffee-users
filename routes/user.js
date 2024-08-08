import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
const router = express.Router();

const URI = process.env.MONGODB_URI;

router.get("/", async (req, res) => {
  const client = new MongoClient(URI);
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
});
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


// Ruta POST: Agregar un nuevo usuario
router.post('/', async (req, res) => {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const database = client.db("aroma");
    const collection = database.collection("user");

    const newUser = {
      ...req.body,           // Incluye todos los datos enviados en el cuerpo de la solicitud
      createdAt: new Date(), // Agrega el campo createdAt con la fecha y hora actual
    };

    const result = await collection.insertOne(newUser);
    console.log("User inserted:", result.insertedId);
    res.status(201).json({ message: "User created successfully", userId: result.insertedId });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
});

export default router;
