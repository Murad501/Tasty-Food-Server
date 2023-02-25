const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const userName = "Person14";
const password = "1ird016vxtOjD82x";

app.get("/", (req, res) => {
  res.send("data is coming soon");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@user1.istzhai.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(new Date());

const run = async () => {
  try {
    const foodCollections = client.db("tasty-food").collection("foods");
    const categoryCollections = client
      .db("tasty-food")
      .collection("categories");

    app.get("/foods", async (req, res) => {
      const query = {};
      const result = await foodCollections.find(query).toArray();
      res.send(result);
    });

    app.get("/top-foods", async (req, res) => {
      const query = {};
      const result = (await foodCollections.find(query).toArray())
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 3);
      res.send(result);
    });

    app.get('/category-food/:id', async(req, res)=>{
        const id = req.params.id
        console.log(id)
        const query = {categoryId: id}
        const result = await foodCollections.find(query).toArray()
        console.log(result)
        res.send(result)
    })

    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categoryCollections.find(query).toArray();
      res.send(result);
    });
  } catch {}
};

run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("server running on port", port);
});
