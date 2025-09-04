import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsArrowRightShort } from 'react-icons/bs';
import { FaBoxes, FaTags, FaStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { RiFileListLine } from "react-icons/ri";
import { LuChartBar, LuWallet, LuCoins } from "react-icons/lu";
import { CiDiscount1 } from "react-icons/ci";

// Helper function to get one year from now in YYYY-MM-DD format
const getOneYearFromNow = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

const ProductComponent = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: null,
    Product_name: "",
    Product_Id: "",
    Category: "",
    Price: "",
    Quantity: "",
    Unit: "pcs",
    Expiry_Date: "",
    Threshold_value: "",
    image: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct({
      ...product,
      Expiry_Date: product.Expiry_Date.split('T')[0],
    });
    setSelectedFile(null);
    setIsEditing(true);
    setShowAddEdit(true);
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err.response?.data || err.message);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      for (const key in currentProduct) {
        if (key !== 'image') {
          if (key === 'Expiry_Date' && currentProduct[key] === '') {
            continue;
          }
          if (currentProduct[key] !== null && currentProduct[key] !== '') {
            formData.append(key, currentProduct[key]);
          }
        }
      }

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (isEditing && !selectedFile && currentProduct.image) {
        formData.append("image", currentProduct.image);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${currentProduct._id}`, formData, config);
      } else {
        await axios.post("http://localhost:5000/api/products", formData, config);
      }

      fetchProducts();

      setShowAddEdit(false);
      setIsEditing(false);
      setCurrentProduct({
        _id: null,
        Product_name: "",
        Product_Id: "",
        Category: "",
        Price: "",
        Quantity: "",
        Unit: "pcs",
        Expiry_Date: "",
        Threshold_value: "",
        image: null,
      });
      setSelectedFile(null);

    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving product. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    const newValue = (field === 'Expiry_Date' && value === '') ? null : value;
    setCurrentProduct({
      ...currentProduct,
      [field]: newValue,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const getImageUrl = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    if (currentProduct.image) {
      return `http://localhost:5000${currentProduct.image}`;
    }
    return null;
  };

  const getStatus = (quantity, threshold) => {
    if (quantity <= 0) return "Out of stock";
    if (quantity <= threshold) return "Low stock";
    return "In-stock";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In-stock": return "#10B981";
      case "Low stock": return "#F59E0B";
      case "Out of stock": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Header and Add Button Section for desktop */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", display: 'none' }}>Product</h2>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px 16px",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              width: "250px",
              fontSize: "14px",
              backgroundColor: "white",
              display: 'none'
            }}
          />
          <button
            onClick={() => {
              setCurrentProduct({
                _id: null,
                Product_name: "",
                Product_Id: "",
                Category: "",
                Price: "",
                Quantity: "",
                Unit: "pcs",
                Expiry_Date: getOneYearFromNow(),
                Threshold_value: "",
                image: null,
              });
              setSelectedFile(null);
              setIsEditing(false);
              setShowAddEdit(true);
            }}
            style={{
              padding: "10px 16px",
              backgroundColor: "#4F46E5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
              display: 'none'
            }}
          >
            + Add Product
          </button>
        </div>
      </div>
      
      {/* Mobile-first Layout */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          gap: '24px'
        }
      }}>

        {/* Dashboard Card Container */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "20px",
          flex: 1
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>Overall Inventory</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", color: "#6B7280", fontWeight: "500" }}>Categories</span>
              <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", marginTop: "4px" }}>14</span>
              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Last 7 days</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", color: "#6B7280", fontWeight: "500" }}>Total Products</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>868</span>
                <span style={{ fontSize: "16px", color: "#10B981", fontWeight: "500" }}>₹25000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Last 7 days</span>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Revenue</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", color: "#6B7280", fontWeight: "500" }}>Top Selling</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>5</span>
                <span style={{ fontSize: "16px", color: "#6B7280", fontWeight: "500" }}>₹2500</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Last 7 days</span>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Cost</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "14px", color: "#6B7280", fontWeight: "500" }}>Low Stocks</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>12</span>
                <span style={{ fontSize: "16px", color: "#EF4444", fontWeight: "500" }}>2</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Ordered</span>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Not in stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products List Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          padding: "20px",
          flex: 2,
          position: "relative"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>Products</h3>
            <button
              onClick={() => {
                setCurrentProduct({
                  _id: null,
                  Product_name: "",
                  Product_Id: "",
                  Category: "",
                  Price: "",
                  Quantity: "",
                  Unit: "pcs",
                  Expiry_Date: getOneYearFromNow(),
                  Threshold_value: "",
                  image: null,
                });
                setSelectedFile(null);
                setIsEditing(false);
                setShowAddEdit(true);
              }}
              style={{
                backgroundColor: "#4F46E5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 20px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              Add Product
            </button>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "500", color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>Products</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "500", color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>Availability</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "500", color: "#6B7280", borderBottom: "1px solid #E5E7EB" }}>Action</th> {/* New Header */}
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) => p.Product_name.toLowerCase().includes(search.toLowerCase()))
                  .map((p) => {
                    const status = getStatus(p.Quantity, p.Threshold_value);
                    const statusColor = getStatusColor(status);
                    
                    return (
                      <tr key={p._id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "12px 16px", fontSize: "14px", color: "#111827" }}>{p.Product_name}</td>
                        <td style={{ padding: "12px 16px", fontSize: "14px", color: statusColor, fontWeight: "500" }}>
                          {status}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <button
                            onClick={() => handleEditClick(p)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              marginRight: '8px',
                              padding: '6px'
                            }}
                          >
                            <FaEdit size={16} color="#4F46E5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p._id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '6px'
                            }}
                          >
                            <FaTrashAlt size={16} color="#EF4444" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
      
      {/* Footer Navigation */}
      
        
      

      {/* Modal for Add/Edit Product */}
      {showAddEdit && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
              {isEditing ? "Edit Product" : "Add Product"} › Individual Product
            </h3>
            
            <div
              style={{
                border: "2px dashed #D1D5DB",
                borderRadius: "8px",
                padding: "32px",
                textAlign: "center",
                marginBottom: "24px",
                position: "relative",
                cursor: "pointer"
              }}
              onClick={() => document.getElementById('image-upload-input').click()}
            >
              {getImageUrl() ? (
                <img src={getImageUrl()} alt="Product Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} />
              ) : (
                <>
                  <p style={{ margin: "0 0 8px 0", color: "#6B7280" }}>Drag image here or</p>
                  <button type="button" style={{
                    padding: "8px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}>
                    Browse image
                  </button>
                </>
              )}
              {getImageUrl() && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    handleInputChange('image', null);
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(255, 255, 255, 0.7)",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <MdOutlineCancel size={20} color="#EF4444" />
                </button>
              )}
              <input
                id="image-upload-input"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            
            <form onSubmit={handleSaveProduct}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={currentProduct.Product_name}
                    onChange={(e) => handleInputChange("Product_name", e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Product ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product ID"
                    value={currentProduct.Product_Id}
                    onChange={(e) => handleInputChange("Product_Id", e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Category
                  </label>
                  <select
                    value={currentProduct.Category}
                    onChange={(e) => handleInputChange("Category", e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "14px",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="">Select product category</option>
                    <option value="Food">Food</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={currentProduct.Price}
                    onChange={(e) => handleInputChange("Price", e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Enter product quantity"
                    value={currentProduct.Quantity}
                    onChange={(e) => handleInputChange("Quantity", e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Unit
                  </label>
                  <select
                    value={currentProduct.Unit}
                    onChange={(e) => handleInputChange("Unit", e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "14px",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                    <option value="pack">pack</option>
                    <option value="Packets">Packets</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    placeholder="Enter expiry date"
                    value={currentProduct.Expiry_Date}
                    onChange={(e) => handleInputChange("Expiry_Date", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                    Threshold Value
                  </label>
                  <input
                    type="number"
                    placeholder="Enter threshold value"
                    value={currentProduct.Threshold_value}
                    onChange={(e) => handleInputChange("Threshold_value", e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEdit(false);
                    setIsEditing(false);
                    setCurrentProduct({
                      _id: null,
                      Product_name: "",
                      Product_Id: "",
                      Category: "",
                      Price: "",
                      Quantity: "",
                      Unit: "pcs",
                      Expiry_Date: "",
                      Threshold_value: "",
                      image: null,
                    });
                    setSelectedFile(null);
                  }}
                  style={{
                    padding: "10px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#4F46E5",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  {isEditing ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductComponent;