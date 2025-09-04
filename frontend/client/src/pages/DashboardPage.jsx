import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeContent from "../components/HomeContent";
import ProductComponent from "../components/ProductComponent";
import InvoiceComponent from "../components/InvoiceComponent";
import StatisticsComponent from "../components/StatisticsComponent";
import SettingComponent from "../components/SettingComponent";
import "./../styles/Dashboard.css";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // full user object (id, name, email, etc.)
    } else {
      // fallback if no user found
      setUser(null);
      navigate("/login"); 
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }
}, [navigate]);

  const getHeading = () => {
    switch (activePage) {
      case "products": return "Products";
      case "invoice": return "Invoice";
      case "statistics": return "Statistics";
      case "setting": return "Setting";
      case "home":
      default: return "Home";
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "products": return <ProductComponent />;
      case "invoice": return <InvoiceComponent />;
      case "statistics": return <StatisticsComponent />;
      case "setting": return <SettingComponent user={user} setUser={setUser} />;
      case "home":
      default: return <HomeContent />;
    }
  };

  return (
    <div className="dashboard-layout">
      
      <aside className="sidebar">
        <h2 className="logo">IMS</h2>
        <ul className="nav-menu">
          <li className={activePage==="home" ? "active" : ""} onClick={() => setActivePage("home")}>Home</li>
          <li className={activePage==="products" ? "active" : ""} onClick={() => setActivePage("products")}>Product</li>
          <li className={activePage === "invoice" ? "active" : ""}onClick={() => setActivePage("invoice")}>Invoice</li>
          <li className={activePage === "statistics" ? "active" : ""}onClick={() => setActivePage("statistics")}>Statistics</li>
          <li className={activePage === "setting" ? "active" :""}onClick={() => setActivePage("setting")}>Setting</li>
        </ul>
        
      
        {user && (
  <div className="user-profile">
    <div className="user-avatar">{user.name?.[0] || "U"}</div>
    <span>{user.name}</span>
  </div>
)}
      </aside>

     
      <main className="main-content">
        <header className="topbar">
          <h1>{getHeading()}</h1>
          <div className="search-container">
            <input type="text" placeholder="Search here..." />
            <i className="fa fa-search"></i>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
