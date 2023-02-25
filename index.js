const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
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

const run = async () => {
  try {
    const foodCollections = client.db("tasty-food").collection("foods");
    const categoryCollections = client.db('tasty-food').collection('categories')

    app.get('/categories', async(req, res)=> {
        const query = {}
        const result = await categoryCollections.find(query).toArray()
        res.send(result)
    })
  } catch {}
};

run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("server running on port", port);
});
