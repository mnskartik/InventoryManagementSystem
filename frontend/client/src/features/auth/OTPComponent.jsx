import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImg from "../../assets/loginimg.png";
import "../../styles/OTPComponent.css"; // ✅ new CSS file for responsiveness

const OTPComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Email passed via navigate('/otp', { state: { email } });
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      setMessage(res.data.msg || "OTP verified successfully!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="otp-container">
      {/* Left Container: Form */}
      <div className="otp-form-section">
        <h2 className="otp-title">Enter Your OTP</h2>
        <p className="otp-subtext">
          We’ve sent a 6-digit OTP to your email <strong>{email}</strong>.
          Please enter it below to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your 6-digit OTP"
            />
          </div>

          <button type="submit" className="otp-button">
            Confirm
          </button>
        </form>

        {message && (
          <p className={`otp-message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>

      {/* Right Container: Illustration */}
      <div className="otp-illustration">
        <div
          className="otp-image"
          style={{ backgroundImage: `url(${loginImg})` }}
        />
      </div>
    </div>
  );
};

export default OTPComponent;
