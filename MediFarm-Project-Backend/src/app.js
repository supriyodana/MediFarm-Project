const express = require("express");
const cors = require("cors");

const app = express();





app.use(express.json());


app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", 
  credentials: true
}));



module.exports = app;