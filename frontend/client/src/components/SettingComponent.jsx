import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SettingComponent = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(user || {});
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  // Load user profile + accounts on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    if (storedUser) {
      setProfile({
        _id: storedUser._id || storedUser.id || "", // ✅ prefer _id, fallback to id
        name: storedUser.name || "",
        email: storedUser.email || "",
        password: "",
        confirmPassword: "",
      });
    }

    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/accounts`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
        setAccounts(res.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Save profile (update in DB + localStorage)
  const handleSaveProfile = async () => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/auth/update`,
      {
        name: profile.name,
        email: profile.email,
        password: profile.password || undefined, // only if provided
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    // ✅ Keep consistent user object
    const updatedUser = res.data.user || res.data;

    // Update localStorage & parent state
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // ✅ Update profile state so fields don't reset
    setProfile({
      ...profile,
      name: updatedUser.name,
      email: updatedUser.email,
      password: "",
      confirmPassword: "",
    });

    alert("Profile updated!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile");
  }
};

  const handleDeleteAccount = async (email) => {
  try {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/users/accounts/${email}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    // Update state after successful deletion
    setAccounts((prevAccounts) => prevAccounts.filter((acc) => acc !== email));
    alert(`Account with email ${email} deleted successfully`);
  } catch (error) {
    console.error("Error deleting account:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Failed to delete account");
  }
};


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setActiveTab("profile")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderBottom:
              activeTab === "profile" ? "3px solid #333" : "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("accounts")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderBottom:
              activeTab === "accounts" ? "3px solid #333" : "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Account Management
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div style={{ marginBottom: "15px" }} key={field}>
              <label style={{ display: "block" }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field.toLowerCase().includes("password") ? "password" : "text"}
                name={field}
                value={profile[field] || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          ))}
          <button
            onClick={handleSaveProfile}
            style={{
              padding: "10px 20px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Save
          </button>
        </div>
      )}

      {/* Accounts Tab */}
      {activeTab === "accounts" && (
        <div>
          <p style={{ fontWeight: "bold" }}>Identity verification</p>
          <p style={{ marginBottom: "20px" }}>Verified</p>
          <p style={{ fontWeight: "bold" }}>Add Accounts</p>
          {accounts.map((acc, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            >
              <span>{acc}</span>
              <button
                onClick={() => handleDeleteAccount(acc)}
                style={{
                  padding: "5px 10px",
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "red",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              float: "right",
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingComponent;
