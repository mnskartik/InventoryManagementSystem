import React, { useState, useEffect } from "react";
import axios from "axios";

const InvoiceComponent = () => {
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [taxRate, setTaxRate] = useState(10); // Configurable tax rate
  const [loading, setLoading] = useState(false);

  const [currentInvoice, setCurrentInvoice] = useState({
    _id: null,
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    referenceNumber: generateReferenceNumber(),
  });

  // Generate a unique reference number
  function generateReferenceNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `INV-${timestamp}-${random}`;
  }

  // Fetch invoices and products
  useEffect(() => {
    fetchInvoices();
    fetchProducts();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/invoices`);
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      alert("Failed to fetch invoices. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Authentication token not found.");
        return;
      }

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
  headers: { Authorization: `Bearer ${token}` },
});
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to fetch products. Please check your connection.");
    }
  };

  // -------------------------
  // CRUD HANDLERS
  // -------------------------

  const handleSaveInvoice = async (e) => {
    e.preventDefault();

    if (!currentInvoice.customerName.trim()) {
      alert("Customer Name is required!");
      return;
    }

    try {
      const subtotal = selectedProducts.reduce(
        (sum, item) => sum + (item.Price || item.price) * item.quantity,
        0
      );
      const taxAmount = subtotal * (taxRate / 100);
      const totalAmount = subtotal + taxAmount;

      const invoiceData = {
        customer: currentInvoice.customerName,
        email: currentInvoice.customerEmail,
        address: currentInvoice.customerAddress,
        invoiceDate: currentInvoice.invoiceDate,
        dueDate: currentInvoice.dueDate,
        notes: currentInvoice.notes,
        referenceNumber: currentInvoice.referenceNumber,
        items: selectedProducts.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.Price || item.price,
        })),
        subtotal,
        taxAmount,
        total: totalAmount,
        status: "Unpaid",
      };

      if (isEditing && currentInvoice._id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/invoices/${currentInvoice._id}`, invoiceData);
        alert("Invoice updated successfully!");
      } else {
        axios.post(`${process.env.REACT_APP_API_URL}/invoices`, {
  ...invoiceData,
  referenceNumber: generateReferenceNumber()
});
        alert("Invoice created successfully!");
      }

      fetchInvoices();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving invoice:", err);
      alert("Error saving invoice. Please check your data and try again.");
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/invoices/${id}`);
      setInvoices(invoices.filter((inv) => inv._id !== id));
      alert("Invoice deleted successfully!");
    } catch (err) {
      console.error("Error deleting invoice:", err);
      alert("Failed to delete invoice. It may be referenced elsewhere.");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      // Optimistically update the UI
      setInvoices(prevInvoices =>
        prevInvoices.map(inv =>
          inv._id === id ? { ...inv, status } : inv
        )
      );

      const res =await axios.patch(`${process.env.REACT_APP_API_URL}/invoices/${id}/status`, {
  status,
});

      // Verify the response and update with actual data from server
      if (res.data && res.data.invoice) {
        setInvoices(prevInvoices =>
          prevInvoices.map(inv => (inv._id === id ? res.data.invoice : inv))
        );
      }

      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);

      // Revert optimistic update on error
      setInvoices(prevInvoices => prevInvoices);

      alert("Failed to update status.");
    }
  };

  const handleEditInvoice = (invoice) => {
    setCurrentInvoice({
      ...invoice,
      // The backend may return 'customer' instead of 'customerName'
      customerName: invoice.customer || invoice.customerName,
      invoiceDate: invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    setSelectedProducts(invoice.items || []);
    setIsEditing(true);
    setShowInvoiceModal(true);
  };

  const handleCloseModal = () => {
    setCurrentInvoice({
      _id: null,
      customerName: "",
      customerEmail: "",
      customerAddress: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
      referenceNumber: generateReferenceNumber(),
    });
    setSelectedProducts([]);
    setIsEditing(false);
    setShowInvoiceModal(false);
  };

  // -------------------------
  // Helpers
  // -------------------------

  const addProductToInvoice = (product) => {
    const existingProduct = selectedProducts.find(
      (p) => p._id === product._id
    );
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          ...product,
          quantity: 1
        }
      ]);
    }
  };

  const removeProductFromInvoice = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
  };

  const updateProductQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeProductFromInvoice(productId);
      return;
    }
    setSelectedProducts(
      selectedProducts.map((p) =>
        p._id === productId
          ? { ...p, quantity: parseInt(quantity) }
          : p
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#10B981";
      case "Unpaid":
        return "#EF4444";
      case "Pending":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${date.toLocaleString(
      "default",
      { month: "short" }
    )}-${date.getFullYear().toString().slice(-2)}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate invoice totals
  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + (item.Price || item.price) * item.quantity,
      0
    );
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    return { subtotal, taxAmount, totalAmount };
  };

  // -------------------------
  // Render
  // -------------------------

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: '#f5f5f5',
      minHeight: "100vh"
    }}>
      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 600px) {
            .responsive-table th, .responsive-table td {
              min-width: 100px; /* Prevents content from being too squished */
              box-sizing: border-box;
            }
            .hide-on-mobile {
              display: none;
            }
          }

          @media (max-width: 768px) {
            .responsive-modal-content {
              flex-direction: column;
            }
            .responsive-modal-form, .responsive-modal-preview {
              padding: 0 !important; /* Reset padding for mobile */
              border-right: none !important; /* Remove separator line */
            }
            .responsive-modal-preview {
              margin-top: 30px;
            }
          }
        `}
      </style>

      <h2 style={{
        fontSize: "2rem",
        marginBottom: "20px",
        color: "#333"
      }}>Invoices</h2>

      {/* Tax Rate Input */}
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>Tax Rate:</label>
        <input
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
          min="0"
          max="30"
          step="0.5"
          style={{
            padding: "5px 10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "60px"
          }}
        />
        <span style={{ marginLeft: "5px" }}>%</span>
      </div>

      <button
        onClick={() => setShowInvoiceModal(true)}
        style={{
          marginBottom: "16px",
          padding: "10px 18px",
          background: "#4F46E5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: 'pointer',
          fontSize: "16px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        + Create Invoice
      </button>

      {/* Loading State */}
      {loading && <div style={{ padding: "20px", textAlign: "center" }}>Loading invoices...</div>}

      {/* Table */}
      {!loading && (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="responsive-table" style={{
            width: "100%",
            minWidth: "600px", /* Prevents table from collapsing too much */
            borderCollapse: "collapse",
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", textAlign: 'left', fontWeight: '600', color: '#555' }}>Invoice ID</th>
                <th className="hide-on-mobile" style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", textAlign: 'left', fontWeight: '600', color: '#555' }}>Reference Number</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", textAlign: 'left', fontWeight: '600', color: '#555' }}>Amount (₹)</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", textAlign: 'left', fontWeight: '600', color: '#555' }}>Status</th>
                <th className="hide-on-mobile" style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", textAlign: 'left', fontWeight: '600', color: '#555' }}>Due Date</th>
                <th className="hide-on-mobile" style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", textAlign: 'left', fontWeight: '600', color: '#555' }}>Customer</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", textAlign: 'left', fontWeight: '600', color: '#555' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => {
                  if (!invoice) return null;

                  return (
                    <tr key={invoice._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px", color: '#333' }}>{invoice._id}</td>
                      <td className="hide-on-mobile" style={{ padding: "12px 16px", color: '#333' }}>{invoice.referenceNumber || "N/A"}</td>
                      <td style={{ padding: "12px 16px", color: '#333' }}>
                        {formatCurrency(invoice.total || invoice.totalAmount || 0)}
                      </td>
                      <td style={{ padding: "12px 16px", color: '#333' }}>
                        <select
                          value={invoice.status}
                          onChange={(e) =>
                            handleUpdateStatus(invoice._id, e.target.value)
                          }
                          style={{
                            backgroundColor: getStatusColor(invoice.status),
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontWeight: "bold"
                          }}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </td>
                      <td className="hide-on-mobile" style={{ padding: "12px 16px", color: '#333' }}>{formatDate(invoice.dueDate)}</td>
                      <td className="hide-on-mobile" style={{ padding: "12px 16px", color: '#333' }}>{invoice.customer}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          style={{
                            marginRight: "8px",
                            padding: '8px 12px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            color: '#4F46E5',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice._id)}
                          style={{
                            color: "white",
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#EF4444',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                    No invoices found. Create your first invoice!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showInvoiceModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              width: "90%",
              maxWidth: "1000px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "10px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#aaa',
              }}
            >
              &times;
            </button>
            <h3 style={{
              marginBottom: "20px",
              color: '#333',
              fontSize: "1.5rem",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px"
            }}>
              {isEditing ? "Edit Invoice" : "Create Invoice"}
            </h3>
            <div className="responsive-modal-content" style={{ display: 'flex', flexGrow: 1, gap: '30px' }}>
              {/* Form Section */}
              <div className="responsive-modal-form" style={{ flex: 1, paddingRight: '20px', borderRight: '1px solid #eee' }}>
                <form onSubmit={handleSaveInvoice}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Customer Name *</label>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={currentInvoice.customerName}
                      onChange={(e) =>
                        setCurrentInvoice({ ...currentInvoice, customerName: e.target.value })
                      }
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Customer Email</label>
                    <input
                      type="email"
                      placeholder="Customer Email"
                      value={currentInvoice.customerEmail}
                      onChange={(e) =>
                        setCurrentInvoice({ ...currentInvoice, customerEmail: e.target.value })
                      }
                      style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Customer Address</label>
                    <textarea
                      placeholder="Customer Address"
                      value={currentInvoice.customerAddress}
                      onChange={(e) =>
                        setCurrentInvoice({ ...currentInvoice, customerAddress: e.target.value })
                      }
                      rows="3"
                      style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Invoice Date</label>
                      <input
                        type="date"
                        value={currentInvoice.invoiceDate}
                        onChange={(e) =>
                          setCurrentInvoice({ ...currentInvoice, invoiceDate: e.target.value })
                        }
                        style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Due Date</label>
                      <input
                        type="date"
                        value={currentInvoice.dueDate}
                        onChange={(e) =>
                          setCurrentInvoice({ ...currentInvoice, dueDate: e.target.value })
                        }
                        style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
                      />
                    </div>
                  </div>


                  <h4 style={{ fontSize: "1.2rem", color: "#555", marginBottom: "15px" }}>Add Products</h4>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '12px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    backgroundColor: "#f9f9f9"
                  }}>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <button
                          type="button"
                          key={product._id}
                          onClick={() => addProductToInvoice(product)}
                          style={{
                            padding: '10px 16px',
                            border: '1px solid #ddd',
                            borderRadius: '25px',
                            background: '#f8f8f8',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'background-color 0.3s ease',
                            whiteSpace: 'nowrap',
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                          }}
                        >
                          {product.Product_name || product.name} ({formatCurrency(product.Price || product.price)})
                        </button>
                      ))
                    ) : (
                      <div style={{ color: '#666', width: '100%', textAlign: 'center' }}>
                        No products available. Add products first.
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: "30px", display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      style={{
                        padding: '12px 24px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        background: 'white',
                        cursor: 'pointer',
                        fontWeight: "bold",
                        color: '#666'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '5px',
                        background: '#4F46E5',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: "bold"
                      }}
                    >
                      {isEditing ? "Update" : "Create"} Invoice
                    </button>
                  </div>
                </form>
              </div>

              {/* Invoice Preview */}
              <div className="responsive-modal-preview" style={{ flex: 1, paddingLeft: '20px' }}>
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  padding: '25px',
                  backgroundColor: '#fefefe',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                }}>
                  <h4 style={{
                    borderBottom: '1px solid #e0e0e0',
                    paddingBottom: '10px',
                    marginBottom: '20px',
                    color: '#333'
                  }}>Invoice Preview</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                      <strong style={{ display: "block", marginBottom: "5px" }}>Reference #</strong>
                      <p style={{ margin: '0', color: '#666' }}>{currentInvoice.referenceNumber}</p>
                    </div>
                    <div>
                      <strong style={{ display: "block", marginBottom: "5px" }}>Date</strong>
                      <p style={{ margin: '0', color: '#666' }}>{currentInvoice.invoiceDate}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <strong style={{ display: "block", marginBottom: "5px" }}>Billed to:</strong>
                    <p style={{ margin: '0' }}>{currentInvoice.customerName || 'Customer Name'}</p>
                    <p style={{ margin: '0' }}>{currentInvoice.customerAddress || 'Customer Address'}</p>
                    <p style={{ margin: '0' }}>{currentInvoice.customerEmail || 'Customer Email'}</p>
                  </div>
                  {selectedProducts.length > 0 ? (
                    <>
                      <table style={{ width: "100%", borderCollapse: 'collapse', marginTop: '20px', tableLayout: 'fixed' }}>
                        <thead>
                          <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>Product</th>
                            <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ccc' }}>Price</th>
                            <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ccc' }}>Qty</th>
                            <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ccc' }}>Total</th>
                            <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ccc', width: "50px" }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProducts.map((item) => (
                            <tr key={item._id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                              <td style={{ padding: '10px', color: "#333" }}>{item.Product_name || item.name}</td>
                              <td style={{ padding: '10px', textAlign: 'right', color: "#333" }}>{formatCurrency(item.Price || item.price)}</td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateProductQuantity(item._id, e.target.value)}
                                  min="1"
                                  style={{ width: '60px', padding: '5px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'right' }}
                                />
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right', color: "#333" }}>
                                {formatCurrency((item.Price || item.price) * item.quantity)}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => removeProductFromInvoice(item._id)}
                                  style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: "1.2rem" }}
                                >
                                  &times;
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ marginTop: '25px', textAlign: 'right' }}>
                        <p style={{ margin: "5px 0" }}>
                          <strong>Subtotal:</strong> {formatCurrency(calculateTotals().subtotal)}
                        </p>
                        <p style={{ margin: "5px 0" }}>
                          <strong>Tax ({taxRate}%):</strong> {formatCurrency(calculateTotals().taxAmount)}
                        </p>
                        <div style={{ borderTop: '2px solid #333', marginTop: '15px', paddingTop: '15px' }}>
                          <strong style={{ fontSize: '1.4em', color: "#333" }}>Total Due:</strong>{" "}
                          <span style={{ fontSize: '1.4em', color: '#4F46E5', fontWeight: 'bold' }}>
                            {formatCurrency(calculateTotals().totalAmount)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      No products added to this invoice
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceComponent;