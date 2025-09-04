const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const path = require('path');
const protect = require("../middleware/authMiddleware");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  getLowStockProducts,
  getExpiringProducts,
} = require('../controllers/productController');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Give the file a unique name to prevent collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure multer file filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/products", protect, getAllProducts);
router.get("/products/search", protect, searchProducts);
router.get("/products/category/:category", protect, getProductsByCategory);
router.get("/products/low-stock", protect, getLowStockProducts);
router.get("/products/expiring", protect, getExpiringProducts);
router.get("/products/:id", protect, getProductById);
// Update routes to use Multer middleware for single file upload
router.post("/products", protect, upload.single('image'), createProduct);
router.put("/products/:id", protect, upload.single('image'), updateProduct);
router.delete("/products/:id", protect, deleteProduct);

module.exports = router;