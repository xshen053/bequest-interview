import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();
const database = {token: "client1" , data: "Hello World" , serverSeqNum: 0};

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.json(database);
});

/**
 * Only when @token match address of client will server update the data.
 * Otherwise, ignore
 */
app.post("/", (req, res) => {
  if (req.body.address == database.token) {
    database.serverSeqNum += 1
    database.data = req.body.data;
    // console.log(database)
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
