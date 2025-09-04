import React from "react";

const Sidebar = () => {
  return (
    <div className="h-screen w-56 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-lg font-bold mb-6">Inventory</h2>
      <nav className="flex flex-col gap-3">
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Dashboard</a>
        <a href="#" className="bg-gray-700 p-2 rounded">Products</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Suppliers</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Stock</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Reports</a>
      </nav>
    </div>
  );
};

export default Sidebar;
