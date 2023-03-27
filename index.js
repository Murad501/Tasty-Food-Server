const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("data is coming soon");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@user1.istzhai.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const foodCollections = client.db("tasty-food").collection("foods");
    const reviewCollections = client.db("tasty-food").collection("reviews");
    const categoryCollections = client
      .db("tasty-food")
      .collection("categories");

    //foods

    app.get("/foods", async (req, res) => {
      const query = {};
      const result = await foodCollections.find(query).toArray();
      res.send(result);
    });

    app.post("/foods", async (req, res) => {
      const food = req.body;
      const result = await foodCollections.insertOne(food);
      res.send(result);
    });

    app.get("/top-foods", async (req, res) => {
      const query = {};
      const result = (await foodCollections.find(query).toArray())
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 3);
      res.send(result);
    });

    //review

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollections.insertOne(review);
      res.send(result);
    });

    app.get("/top-reviews", async (req, res) => {
      const query = {};
      const result = await (await reviewCollections.find(query).toArray())
        .sort((a, b) => b.liked - a.liked)
        .slice(0, 3);

      res.send(result);
    });

    app.get("/my-reviews", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ message: "forbidden" });
      }
      const query = { userEmail: email };
      const result = await reviewCollections.find(query).toArray();
      res.send(result);
    });

    app.get("/food-reviews", async (req, res) => {
      const id = req.query.id;
      const query = { foodId: id };
      const result = await reviewCollections.find(query).toArray();
      res.send(result);
    });

    //category

    app.get("/category-food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryId: id };
      const result = await foodCollections.find(query).toArray();
      res.send(result);
    });

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
