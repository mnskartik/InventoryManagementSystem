import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ProductComponent from "./ProductComponent";
import InvoiceComponent from "./InvoiceComponent";

const StatisticsComponent = () => {
  // Dummy data for chart
  const data = [
    { name: "Jan", Purchase: 45000, Sales: 38000 },
    { name: "Feb", Purchase: 52000, Sales: 42000 },
    { name: "Mar", Purchase: 40000, Sales: 37000 },
    { name: "Apr", Purchase: 38000, Sales: 35000 },
    { name: "May", Purchase: 36000, Sales: 30000 },
    { name: "Jun", Purchase: 30000, Sales: 22000 },
    { name: "Jul", Purchase: 42000, Sales: 35000 },
  ];

  const topProducts = ["Redbull", "Kit Kat", "Coca Cola", "Milo", "Ariel", "Bru"];

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{
          flex: 1,
          background: "#FFD740",
          padding: "20px",
          borderRadius: "10px",
          color: "#000",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h3>Total Revenue</h3>
          <h2>₹2,32,875</h2>
          <p style={{ color: "green" }}>+20.1% from last month</p>
          
        </div>

        <div style={{
          flex: 1,
          background: "#00E5FF",
          padding: "20px",
          borderRadius: "10px",
          color: "#000",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h3>Products Sold</h3>
          <h2>8,294</h2>
          <p style={{ color: "green" }}>+18.01% from last month</p>
          
        </div>

        <div style={{
          flex: 1,
          background: "#E040FB",
          padding: "20px",
          borderRadius: "10px",
          color: "#000",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h3>Products in Stock</h3>
          <h2>234</h2>
          <p style={{ color: "green" }}>+1% from last month</p>
        </div>
      </div>

      {/* Sales & Purchase Chart + Top Products */}
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Chart */}
        <div style={{
          flex: 3,
          background: "#2E2E3A",
          padding: "20px",
          borderRadius: "10px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <h3>Sales & Purchase</h3>
            <button style={{
              background: "#444",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              color: "#fff",
              cursor: "pointer"
            }}>
              Weekly
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Purchase" fill="#42A5F5" />
              <Bar dataKey="Sales" fill="#66BB6A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div style={{
          flex: 1,
          background: "#FFD740",
          padding: "20px",
          borderRadius: "10px",
          color: "#000"
        }}>
          <h3>Top Products</h3>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
            {topProducts.map((prod, i) => (
              <li key={i} style={{
                margin: "10px 0",
                display: "flex",
                justifyContent: "space-between"
              }}>
                {prod}
                <span>{"⭐".repeat(5 - (i % 3))}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatisticsComponent;
