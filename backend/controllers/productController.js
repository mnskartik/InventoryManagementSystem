const Product = require("../models/Product");

// Get all products (only for logged-in user)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const {
      Product_name,
      Product_Id,
      Category,
      Price,
      Quantity,
      Unit,
      Expiry_Date,
      Threshold_value
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({
      Product_name,
      Product_Id,
      Category,
      Price,
      Quantity,
      Unit,
      Expiry_Date,
      Threshold_value,
      image, // Save the image path
      createdBy: req.user.id,
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Product ID already exists" });
    } else if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ message: "Validation error", errors });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Check if a new file was uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Product ID already exists" });
    } else if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).json({ message: "Validation error", errors });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({
      Category: category,
      createdBy: req.user.id,
    }).sort({ Product_name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      createdBy: req.user.id, // ✅ restrict to user
      $or: [
        { Product_name: { $regex: query, $options: "i" } },
        { Product_Id: { $regex: query, $options: "i" } },
        { Category: { $regex: query, $options: "i" } },
      ],
    }).sort({ Product_name: 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.user.id,
      $expr: { $lte: ["$Quantity", "$Threshold_value"] },
    }).sort({ Quantity: 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get expired or soon-to-expire products
const getExpiringProducts = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(days));

    const products = await Product.find({
      createdBy: req.user.id,
      Expiry_Date: { $lte: targetDate },
    }).sort({ Expiry_Date: 1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  getLowStockProducts,
  getExpiringProducts,
};
