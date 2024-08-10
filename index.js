const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middlewere
app.use(
  cors({
    origin: [
      "https://creative-canvas-24236.web.app",
      "https://creative-canvas-24236.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dbn21dt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db("craftDB").collection("craft");
    const subCraftCollection = client.db("craftDB").collection("subcraft");

    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myCrafts/:email", async (req, res) => {
      const emails = req.params.email;
      const cursor = craftCollection.find({ email: emails });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCraft = req.body;
      const craft = {
        $set: {
          craft: updateCraft.craft,
          subcategory: updateCraft.subcategory,
          stock: updateCraft.stock,
          description: updateCraft.description,
          process: updateCraft.process,
          price: updateCraft.price,
          rating: updateCraft.rating,
          photo: updateCraft.photo,
          customization: updateCraft.customization,
        },
      };
      const result = await craftCollection.updateOne(query, craft, options);
      res.send(result);
    });

    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    // subCraftCollection

    app.get("/subcraft", async (req, res) => {
      const cursor = subCraftCollection.find();
      const result = await cursor.toArray();
      console.log(cursor);
      res.send(result);
    });

    app.get("/subcraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await subCraftCollection.findOne(query);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Is Runing His Own Way");
});

app.listen(port, () => {
  console.log(`Server is runing from port ${port}`);
});
