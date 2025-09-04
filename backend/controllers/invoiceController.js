const Invoice = require("../models/Invoice");

// ✅ Get invoices of logged-in user only
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id })
      .populate("items.product");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invoices", error: err.message });
  }
};

// ✅ Create invoice linked to logged-in user
exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice({
      ...req.body,
      user: req.user.id, // Attach logged-in user
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Error creating invoice", error: err.message });
  }
};

// ✅ Update invoice only if it belongs to user
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found or not yours" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Error updating invoice", error: err.message });
  }
};

// ✅ Delete invoice only if it belongs to user
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found or not yours" });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting invoice", error: err.message });
  }
};

// ✅ Update status only if it belongs to user
exports.updateStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found or not yours" });
    res.json({ invoice });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};
