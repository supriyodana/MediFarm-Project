const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");
const sessionAuth = require("../middleware/sessionAuth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protected", sessionAuth, (req, res) => {
  res.json({ message: `Welcome ${req.user.name || req.user.email}! You are authenticated.`, user: req.user });
});

module.exports = router;
