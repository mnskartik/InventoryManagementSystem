import React, { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import "./../styles/ProductPage.css";

// Simple Modal Component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <div className="modal-footer">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Rice", category: "Food", supplier: "ABC Ltd", purchasePrice: 50, sellingPrice: 70, stock: 120, status: "In Stock" },
    { id: 2, name: "Oil", category: "Grocery", supplier: "XYZ Co", purchasePrice: 100, sellingPrice: 130, stock: 20, status: "Low Stock" },
  ]);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleDelete = () => {
    setProducts(products.filter((p) => p.id !== currentProduct.id));
    setShowDelete(false);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (currentProduct?.id) {
      setProducts(products.map((p) => (p.id === currentProduct.id ? currentProduct : p)));
    } else {
      setProducts([...products, { ...currentProduct, id: Date.now() }]);
    }
    setShowAddEdit(false);
  };

  return (
    <div className="products-container">
      <Sidebar />
      <div className="products-main">
        {/* Header */}
        <div className="products-header">
          <h2>Products</h2>
          <div className="header-actions">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <Button onClick={() => { setCurrentProduct({}); setShowAddEdit(true); }}>+ Add Product</Button>
            <Button variant="outline" onClick={() => setShowImport(true)}>Import</Button>
          </div>
        </div>

        {/* Product Table */}
        <Card className="table-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell>₹{product.purchasePrice}</TableCell>
                    <TableCell>₹{product.sellingPrice}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <span className={`status-badge ${product.status === "In Stock" ? "in-stock" : "low-stock"}`}>
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="table-actions">
                        <Button
                          variant="outline"
                          onClick={() => { setCurrentProduct(product); setShowAddEdit(true); }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => { setCurrentProduct(product); setShowDelete(true); }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>

        {/* Add/Edit Modal */}
        <Modal open={showAddEdit} onClose={() => setShowAddEdit(false)}>
          <h3 className="modal-title">{currentProduct?.id ? "Edit Product" : "Add Product"}</h3>
          <form onSubmit={handleSaveProduct} className="modal-form">
            <label>Product Name</label>
            <Input
              placeholder="Product Name"
              value={currentProduct?.name || ""}
              onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
            />
            <label>Category</label>
            <Input
              placeholder="Category"
              value={currentProduct?.category || ""}
              onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
            />
            <label>Supplier</label>
            <Input
              placeholder="Supplier"
              value={currentProduct?.supplier || ""}
              onChange={(e) => setCurrentProduct({ ...currentProduct, supplier: e.target.value })}
            />
            <label>Purchase Price</label>
            <Input
              type="number"
              placeholder="Purchase Price"
              value={currentProduct?.purchasePrice || ""}
              onChange={(e) => setCurrentProduct({ ...currentProduct, purchasePrice: e.target.value })}
            />
            <label>Selling Price</label>
            <Input
              type="number"
              placeholder="Selling Price"
              value={currentProduct?.sellingPrice || ""}
              onChange={(e) => setCurrentProduct({ ...currentProduct, sellingPrice: e.target.value })}
            />
            <label>Stock</label>
            <Input
              type="number"
              placeholder="Stock"
              value={currentProduct?.stock || ""}
              onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
            />
            <Button type="submit">Save</Button>
          </form>
        </Modal>

        {/* Delete Modal */}
        <Modal open={showDelete} onClose={() => setShowDelete(false)}>
          <h3 className="modal-title">Delete Product?</h3>
          <p>Are you sure you want to delete <b>{currentProduct?.name}</b>?</p>
          <div className="modal-actions">
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </Modal>

        {/* Import Modal */}
        <Modal open={showImport} onClose={() => setShowImport(false)}>
          <h3 className="modal-title">Import Products</h3>
          <div className="import-box">
            <p>Drag and drop CSV/Excel file here</p>
            <Input type="file" accept=".csv,.xlsx,.xls" />
            <Button className="upload-btn">Upload</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProductsPage;
