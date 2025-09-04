import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaBoxes, FaTags, FaStar } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { RiFileListLine } from "react-icons/ri";
import { LuChartBar, LuWallet, LuCoins } from "react-icons/lu";
import { CiDiscount1 } from "react-icons/ci";
import { BsArrowRightShort } from 'react-icons/bs';

const HomeContent = () => {
  const [isMobile, setIsMobile] = useState(false);

  // detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dummy chart data
  const salesPurchaseData = [
    { name: "Jan", sales: 50000, purchase: 40000 },
    { name: "Feb", sales: 45000, purchase: 35000 },
    { name: "Mar", sales: 38000, purchase: 32000 },
    { name: "Apr", sales: 42000, purchase: 38000 },
    { name: "May", sales: 35000, purchase: 30000 },
    { name: "Jun", sales: 25000, purchase: 22000 },
  ];

  // Refactored stat data
  const salesStats = [
    { icon: <LuChartBar style={{ fontSize: '20px' }} />, value: "₹832", label: "Sales", color: "#61A5C2" },
    { icon: <LuWallet style={{ fontSize: '20px' }} />, value: "₹18,300", label: "Revenue", color: "#FFD700" },
    { icon: <LuCoins style={{ fontSize: '20px' }} />, value: "₹868", label: "Profit", color: "#32CD32" },
    { icon: <CiDiscount1 style={{ fontSize: '20px' }} />, value: "₹17,432", label: "Cost", color: "#FF69B4" },
  ];

  const purchaseStats = [
    { icon: <RiFileListLine style={{ fontSize: '20px' }} />, value: "82", label: "Purchase", color: "#61A5C2" },
    { icon: <LuCoins style={{ fontSize: '20px' }} />, value: "₹13,573", label: "Cost", color: "#FFD700" },
    { icon: <MdOutlineCancel style={{ fontSize: '20px' }} />, value: "5", label: "Cancel", color: "#32CD32" },
    { icon: <CiDiscount1 style={{ fontSize: '20px' }} />, value: "₹17,432", label: "Return", color: "#BA55D3" },
  ];

  const topProducts = [
    { name: "Redbull", rating: 4.5 },
    { name: "Kit Kat", rating: 4.0 },
    { name: "Coca cole", rating: 4.5 },
    { name: "Milo", rating: 4.0 },
    { name: "Ariel", rating: 3.5 },
    { name: "Bru", rating: 3.0 },
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div style={{ display: 'flex' }}>
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} style={{ color: '#FFD700' }} />)}
        {halfStar && <FaStar key="half" style={{ color: '#FFD700', opacity: 0.5 }} />}
        {[...Array(emptyStars)].map((_, i) => <FaStar key={`empty-${i}`} style={{ color: '#ccc' }} />)}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: '#f5f7fa',
      padding: '20px',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Main Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
        gap: '20px',
      }}>
        {/* Left Column */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '20px' }}>
          {/* Sales Overview */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Sales Overview</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '15px',
            }}>
              {salesStats.map((stat, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  padding: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: stat.color,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '15px',
                    color: '#fff',
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748' }}>{stat.value}</span>
                    <span style={{ fontSize: '12px', color: '#718096' }}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Overview */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600', color: '#333' }}>Purchase Overview</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: '15px',
            }}>
              {purchaseStats.map((stat, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '10px',
                  padding: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: stat.color,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '15px',
                    color: '#fff',
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748' }}>{stat.value}</span>
                    <span style={{ fontSize: '12px', color: '#718096' }}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales & Purchase Chart */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>Sales & Purchase</h3>
              <button style={{
                padding: '8px 15px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#4a5568',
                fontWeight: '500'
              }}>Weekly</button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesPurchaseData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px', fill: '#718096' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px', fill: '#718096' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                />
                <Bar dataKey="purchase" fill="#61A5C2" name="Purchase" barSize={15} radius={[5, 5, 0, 0]} />
                <Bar dataKey="sales" fill="#32CD32" name="Sales" barSize={15} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#61A5C2', borderRadius: '2px', marginRight: '5px' }}></span>
                <span style={{ fontSize: '14px', color: '#718096' }}>Purchase</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: '#32CD32', borderRadius: '2px', marginRight: '5px' }}></span>
                <span style={{ fontSize: '14px', color: '#718096' }}>Sales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '20px' }}>
          {/* Inventory Summary, Product Summary, Top Products (unchanged) */}
          {/* ... keep same code as you had ... */}
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
