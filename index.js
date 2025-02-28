// import http from "http";
const { Server } = require("socket.io");
const express = require("express");
const fileName = "./mock-historic-data/historic-data.json";
const file = require(fileName);
const app = express();
const port = 3000;
const httpServer = require("http").createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:4200" },
});

io.on("connection", (client) => {
  var timesRun = 0;
  var interval = setInterval(function () {
    timesRun += 1;
    if (timesRun === 3) {
      clearInterval(interval);
    }
    client.emit("get-history", JSON.stringify(file));
  }, 500);

  client.on("update-sensor-chart", (sensor) => {
    const fs = require("fs");
    fs.writeFileSync(
      "./mock-historic-data/live-data.json",
      JSON.stringify(sensor, null, 4)
    );
  });

  client.on("update-sensor-record", (sensor) => {
    const fs = require("fs");
    fs.writeFileSync(
      "./mock-historic-data/historic-data.json",
      JSON.stringify(sensor, null, 4)
    );
  });
});

app.get("/", (req, res) => {
  res.send("NodeJs server started!");
});

httpServer.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
