const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/adminController");
const { createProduct, updateProductByMedId, deleteProductByMedId } = require("../controllers/productController");

const sessionAuth = require("../middleware/sessionAuth");
const { isAdmin } = require("../middleware/roleMiddleware");



router.post("/login", loginAdmin);

//for testing purpose
router.get("/me", sessionAuth, (req, res) => {
  res.json({ user: req.user });
  console.log("This one --> " , req.user);
});




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

// Admin product management
router.post("/products", sessionAuth, isAdmin, createProduct);
router.put("/products/:med_id", sessionAuth, isAdmin, updateProductByMedId);
router.delete("/products/:med_id", sessionAuth, isAdmin, deleteProductByMedId);








module.exports = router;