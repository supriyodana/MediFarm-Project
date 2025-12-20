const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController");
const { placeOrder, getMyOrders, getOrderDetails, cancelOrder } = require("../controllers/orderController");
const sessionAuth = require("../middleware/sessionAuth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protected", sessionAuth, (req, res) => {
  res.json({ message: `Welcome ${req.user.name || req.user.email}! You are authenticated.`, user: req.user });
});

//cart routes
router.get("/cart", sessionAuth, getCart);
router.post("/cart/add", sessionAuth, addToCart);
router.put("/cart/update/:productId", sessionAuth, updateCartItem);
router.delete("/cart/remove/:productId", sessionAuth, removeFromCart);
router.delete("/cart/clear", sessionAuth, clearCart);


//order routes
router.post("/orders/place", sessionAuth, placeOrder);
router.get("/orders", sessionAuth, getMyOrders);
router.get("/orders/:orderId", sessionAuth, getOrderDetails);
router.put("/orders/:orderId/cancel", sessionAuth, cancelOrder);

module.exports = router;
