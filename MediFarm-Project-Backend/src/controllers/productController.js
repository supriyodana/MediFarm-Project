const Product = require("../models/product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProductByMedId = async (req, res) => {
  try {
    const product = await Product.findOne({ med_id: req.params.med_id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let { med_id, name, description, price, stock, category, image } = req.body;

    
    if (med_id && String(med_id).trim() !== "") {
      med_id = String(med_id).trim();
      const existing = await Product.findOne({ med_id });
      if (existing) return res.status(400).json({ error: "med_id already present/registered" });
    } else {
      med_id = undefined;
    }

    const product = new Product({ med_id, name, description, price, stock, category, image });
    await product.save();
    res.status(201).json({ message: "Product created", data: product });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) return res.status(400).json({ error: "med_id already present/registered" });
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProductByMedId = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ med_id: req.params.med_id }, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product updated", data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteProductByMedId = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ med_id: req.params.med_id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
