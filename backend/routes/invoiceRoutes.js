const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateStatus,
} = require("../controllers/invoiceController");

const router = express.Router();

// Protect all invoice routes
router.get("/invoices", protect, getInvoices);
router.post("/invoices", protect, createInvoice);
router.put("/invoices/:id", protect, updateInvoice);
router.delete("/invoices/:id", protect, deleteInvoice);
router.patch("/invoices/:id/status", protect, updateStatus);

module.exports = router;
