const bodyParser = require("express");
const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();

const MONGO_URI = process.env.MONGO_URI;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", routes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { message, type, value, data } = error;
  res.status(status).json({ message, type, value, data });
});

mongoose
  .connect(MONGO_URI)
  .then(result => {
    const server = app.listen(process.env.PORT || 8000);
    const io = require("./socket").init(server);
    io.on("connection", socket => {
      console.log("client connected");
    });
  })
  .catch(err => console.log(err));
