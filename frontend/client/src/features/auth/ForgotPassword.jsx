import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./../../styles/ForgotPassword.css";
import illustration from "../../assets/loginimg.png";
import axios from "axios";
import OTPComponent from "../../features/auth/OTPComponent";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post(
  `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
  { email }
);
  } catch (err) {
    setMessage(err.response?.data?.msg || "Failed to send OTP");
  }
};


  return (
    <div className="forgot-container">
      {/* Left Section - Form */}
      <div className="forgot-form-section">
        <form onSubmit={handleSubmit} className="forgot-form">
          <h2 className="forgot-title">Forgot Password</h2>
          <p className="forgot-subtext">
            Enter your registered email and we’ll send you a reset link.
          </p>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="forgot-button" >
            Send Reset Link
          </button>

          {message && <p className="forgot-message">{message}</p>}

          <p className="bottom-text">
            Remember your password?{" "}
            <a href="/login" className="login-link">
              Back to Login
            </a>
          </p>
        </form>
      </div>

      {/* Right Section - Illustration */}
      <div className="forgot-illustration">
        <h1>Welcome Back!</h1>
        <p>Reset your password to regain access.</p>
        <img src={illustration} alt="Illustration" />
      </div>
    </div>
  );
};

export default ForgotPassword;
