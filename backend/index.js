const express = require("express");
const app = express();
require('dotenv').config();
const { DBConnection } = require("./dbHandler");
const bodyParser = require("body-parser");

const dbHandler = new DBConnection(["time_tracker"]);

async function main() {
  await dbHandler.initClients();
  app.listen(8083, () => {
    console.log("Server running on port 8083");
  })
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get("/", (req, res) => {
  res.json({ message: 'hi' });
});

app.get("/getStates", async (req, res) => {
  const collection = await dbHandler.getCollection("time_tracker", "trackers");
  const result = await collection.find({"hidden": false}).toArray();
  res.json({ timers: result });
});

app.post("/startTimer", async (req, res) => {
  const body = req.body;
  const { timerName } = body;
  console.log("/startTimer", timerName);
  const collection = await dbHandler.getCollection("time_tracker", "trackers");
  let { start_time, paused_time } = await getExistingState(timerName);
  let newStartTime;
  if (!start_time) {
    newStartTime = new Date();
  } else {
    start_time = new Date(start_time);
    paused_time = new Date(paused_time);
    let diff = Math.abs(new Date() - paused_time);
    newStartTime = new Date(start_time.getTime() + diff);
  }
  const result = await collection.updateOne({ name: timerName }, {
    $set: {
      is_paused: false,
      start_time: newStartTime,
      resumed_time: new Date()
    }
  });
  res.json(result);
});

async function getExistingState(timerName) {
  const collection = await dbHandler.getCollection("time_tracker", "trackers");
  const result = await collection.findOne({ name: timerName });
  console.log(result);
  return result;
}

app.post("/stopTimer", async (req, res) => {
  const body = req.body;
  const { timerName } = body;
  console.log("/stopTimer", timerName);
  const collection = await dbHandler.getCollection("time_tracker", "trackers");
  const result = await collection.updateOne({ name: timerName }, {
    $set: {
      is_paused: true,
      paused_time: new Date()
    }
  });
  res.json(result);
});

app.post("/clearTimer", async (req, res) => {
  const body = req.body;
  const { timerName } = body;
  const collection = await dbHandler.getCollection("time_tracker", "trackers");
  const result = await collection.updateOne({ name: timerName }, {
    $set: {
      is_paused: true,
      paused_time: null,
      resumed_time: null,
      start_time: null
    }
  });
  res.json(result);
});

main();