const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/adminController");
const { createProduct, updateProductByMedId, deleteProductByMedId } = require("../controllers/productController");
const { getAllOrders, getOrderDetailsAdmin, updateOrderStatus, updatePaymentStatus } = require("../controllers/orderController");

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
  // etc



//tst
router.get("/protected", sessionAuth, isAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.username}! You are authenticated.` });
});
//

// product management
router.post("/products", sessionAuth, isAdmin, createProduct);
router.put("/products/:med_id", sessionAuth, isAdmin, updateProductByMedId);
router.delete("/products/:med_id", sessionAuth, isAdmin, deleteProductByMedId);


// order management routes
router.get("/orders", sessionAuth, isAdmin, getAllOrders);
router.get("/orders/:orderId", sessionAuth, isAdmin, getOrderDetailsAdmin);
router.put("/orders/:orderId/status", sessionAuth, isAdmin, updateOrderStatus);
router.put("/orders/:orderId/payment", sessionAuth, isAdmin, updatePaymentStatus);





module.exports = router;