const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/adminController");

const sessionAuth = require("../middleware/sessionAuth");
const { isAdmin } = require("../middleware/roleMiddleware");



router.post("/login", loginAdmin);

/*
router.get("/me", sessionAuth, (req, res) => {
  res.json({ user: req.user });
  console.log("This one --> " , req.user);
});

*/


/// here to add routes like ---
  //add medicine
  // get all users
  // delete user
  // update medicine
  // delete medicine
  // get all medicines
  // get all orders
  // update order status
  // etc



//tst
router.get("/protected", sessionAuth, isAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}! You are authenticated.` });
});
//








module.exports = router;