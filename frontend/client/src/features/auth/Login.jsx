import React, { useState } from "react";
import "./../../styles/LoginPage.css";
import loginImg from "./../../assets/loginimg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);

    setMessage(res.data.msg || "Login successful!");

    // ✅ Save JWT + user in localStorage
    if (res.data.token && res.data.user) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } else {
      console.warn("⚠️ Backend did not return token or user");
    }

    // Redirect to dashboard
    navigate("/dashboard");
  } catch (err) {
    setMessage(err.response?.data?.msg || "Login failed");
  }
};


  return (
    <div className="login-wrapper">
      {/* Left side form */}
      <div className="login-left">
        <div className="login-box">
          <h2 className="login-title">Log in to your account</h2>
          <p className="login-subtitle">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label className="login-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="login-input"
                required
              />
            </div>

            <div>
              <label className="login-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="login-input"
                required
              />
            </div>

            <div className="login-actions">
              <a href="/forgot-password" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              Sign in
            </button>
          </form>

          {message && <p className="login-message">{message}</p>}

          <p className="signup-link">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>

      {/* Right side illustration */}
      <div className="login-right">
        <h1>Welcome to IMS</h1>
        <img src={loginImg} alt="Login Illustration" className="login-illustration" />
      </div>
    </div>
  );
};

export default Login;
