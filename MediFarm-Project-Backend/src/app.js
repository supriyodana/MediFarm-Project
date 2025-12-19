const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const authRoute = require("./routes/authRoute");
const userRoutes = require("./routes/userRoutes");
const publicRoutes = require("./routes/publicRoutes");

const app = express();





app.use(express.json());


app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", 
  credentials: true
}));

require("./config/session")(app);

app.use("/api", authRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/public", publicRoutes);

//here to add later ...
//user , medicine etc routes

module.exports = app;