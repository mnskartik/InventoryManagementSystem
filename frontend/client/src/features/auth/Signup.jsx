import React, { useState } from "react";
import "./../../styles/Signup.css";
import illustration from "../../assets/loginimg.png"; // replace with your image
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    setMessage("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/auth/signup", form);

    setMessage(res.data.msg || "Signup successful!");

    // Save JWT + user info to localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // Redirect to dashboard
    navigate("/dashboard");
  } catch (err) {
    setMessage(err.response?.data?.msg || "Signup failed");
  }
};


  return (
    <div className="signup-container">
      {/* Left Section */}
      <div className="signup-form-section">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Create an account</h2>
          <p>Start inventory management.</p>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Example@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-button">
            Sign up
          </button>

          {message && <p className="signup-message">{message}</p>}

          <p className="bottom-text">
            Do you have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </div>

      {/* Right Section */}
      <div className="signup-illustration">
        <h1>Welcome to IMS</h1>
        <p>Manage your inventory smarter.</p>
        <img src={illustration} alt="Illustration" />
      </div>
    </div>
  );
};

export default Signup;
