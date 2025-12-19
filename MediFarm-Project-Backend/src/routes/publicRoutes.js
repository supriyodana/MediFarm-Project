const express = require("express");
const router = express.Router();

const { getAllProducts, getProductByMedId } = require("../controllers/productController");

router.get("/products", getAllProducts);
router.get("/products/:med_id", getProductByMedId);

module.exports = router;
